import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import vars from '@/vars.js'

Vue.use(Vuex)

const requestOptions = {
    method: 'GET',
    redirect: 'follow',
    timeout: 30 * 1000
}

export default new Vuex.Store({
  state: {
      currentMonth: 0,
      currentStep: 0,
      order: {
          date: null,
          time: [],
          amountOfPeople: 2
      },
      loadingTime: true,
      loadingWindow: true,
      timeTable: null,
      // dayPart values:
      //    0 - night
      //    1 - morning
      //    2 - afternoon
      //    3 - evening (default)
      dayPart: 3,
      requestRepeat: 0,
      restaurantID: 0
  },
  mutations: {
      setID (state, payload) {
          state.restaurantID = payload
      },
      changeMonth (state, payload) {
          state.currentMonth = payload
      },
      changeStep (state, payload) {
          state.currentStep = payload
      },
      chooseDate (state, payload) {
          const currentDate = new Date()
          state.order.date = new Date(currentDate.getFullYear(),currentDate.getMonth() + state.currentMonth, payload)
      },
      chooseTime (state, payload) {
          state.order.time = payload
      },
      changeAmount (state, payload) {
          state.order.amountOfPeople = payload
      },
      changeLoadingTime(state, payload) {
          state.loadingTime = payload
      },
      changeTimeTable(state, payload) {
          state.timeTable = payload
      },
      changeDayPart(state, payload) {
          state.dayPart = payload
      },
      changeRequestRepeat(state, payload) {
          state.requestRepeat = payload
      },
      changeLoading(state) {
          state.loadingWindow = !state.loadingWindow
      }
  },
  actions: {
      changeMonth ({ commit }, payload) {
          commit('changeMonth', payload)
      },
      changeStep ({ commit, dispatch, state }, payload) {

          if (payload < state.currentStep) {
              const currentDate = new Date()
              dispatch('changeMonth', currentDate.getMonth() - state.order.date.getMonth())
          }

          if (payload === 1) {
              dispatch('getTimeTable')
          }

          commit('changeStep', payload)
      },
      chooseDate ({ commit }, payload) {
          commit('chooseDate', payload)
      },
      changeAmount ({ commit }, payload) {
          commit('changeAmount', payload)
      },
      changeDayPart (context, payload) {
          let diff = payload - context.state.dayPart
          if (payload < 0) {
              context.dispatch('changeDay', context.state.order.date.getDate() - 1)
              context.commit('changeDayPart', 3)
          } else if (payload > 3) {
              context.dispatch('changeDay', context.state.order.date.getDate() + 1)
              context.commit('changeDayPart', 0)
          } else {
              context.commit('changeDayPart', payload)
          }

          if (context.state.timeTable.filter(el => el[1] !== null).length) {
              while (!context.state.timeTable.slice(context.state.dayPart * 12, (context.state.dayPart + 1) * 12).filter(el => el[1] !== null).length) {
                  if (diff > 0) {
                      context.commit('changeDayPart', context.state.dayPart === 3 ? 0 : context.state.dayPart + 1)
                  } else {
                      context.commit('changeDayPart', context.state.dayPart === 0 ? 3 : context.state.dayPart - 1)
                  }
              }
          }
      },
      changeDay(context, day) {
          const currentDate = new Date()
          const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + context.state.currentMonth + 1, 0).getDate()
          if (!day) {
              context.commit('changeMonth', context.state.currentMonth - 1)
              context.dispatch('chooseDate', end)
              context.dispatch('getTimeTable')
          } else {
              if (end < day) {
                  context.commit('changeMonth', context.state.currentMonth + 1)
                  context.dispatch('chooseDate', 1)
                  context.dispatch('getTimeTable')
              } else {
                  context.dispatch('chooseDate', day)
                  context.dispatch('getTimeTable')
              }
          }
      },
      getTimeTable (context) {
          context.commit('changeLoadingTime', true)
          let tzoffset = (new Date()).getTimezoneOffset() * 60000
          let day = (new Date(context.state.order.date - tzoffset))
          axios.get(`${vars.api}/api/web-orders/v1/available-space/${context.state.restaurantID}?day=${day.toISOString().slice(0, 10)}`, requestOptions)
              .then(({ data }) => {
                  context.commit('changeLoadingTime', false)
                  context.commit('changeRequestRepeat', false)

                  let arr = []

                  for (const block in data) {
                      arr.push([block, data[block]])
                  }

                  context.commit('changeTimeTable', arr)
                  if (arr.filter(el => el[1] !== null).length) {
                      while (!arr.slice(context.state.dayPart * 12, (context.state.dayPart + 1) * 12).filter(el => el[1] !== null).length) {
                          context.commit('changeDayPart', context.state.dayPart === 3 ? 0 : context.state.dayPart + 1)
                      }
                  }
              })
              .catch(() => {
                  if (context.state.requestRepeat !== 5) {
                      context.commit('changeRequestRepeat', context.state.requestRepeat + 1)
                      setTimeout(() => {
                          context.dispatch('getTimeTable')
                      }, vars.repeatRequestDelay)
                  } else {
                      context.commit('changeRequestRepeat', 0)
                      context.commit('changeStep', context.state.currentStep - 1)
                  }
              })
      },
      sendData (context, payload) {
          axios.post(`${vars.api}/api/web-orders/v1/order/${context.state.restaurantID}`, payload, {headers: {
              'Content-Type': 'application/json'
          }})
              .then(() => {
                  context.commit('changeLoadingTime', false)
              })
              .catch(() => {
                  if (context.state.requestRepeat !== 4) {
                      context.commit('changeRequestRepeat', context.state.requestRepeat + 1)
                      setTimeout(() => {
                          context.dispatch('sendData', payload)
                      }, vars.repeatRequestDelay)
                  } else {
                      context.commit('changeRequestRepeat', 0)
                      context.commit('changeStep', context.state.currentStep - 1)
                  }
              })
      }
  },
  modules: {
  }
})
