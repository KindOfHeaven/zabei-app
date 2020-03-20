<template>

  <div class="time-table">
    <div v-if="!loadingTime" class="time-table__inner">
      <div class="time-table__title">{{ title }}</div>
      <div class="time-table__content">
        <a href="javascript:void(0)" class="arrow arrow_left" :class="{'arrow_disabled': (!currentMonth && currentDate.getDate() === order.date.getDate() && !dayPart) || loadingTime}" @click="changeDayPart(dayPart - 1)"></a>
        <div class="time-table__table">
          <div class="time-table__time" :class="{'time-table__time_inactive': time[1] < order.amountOfPeople, 'time-table__time_active': time[0] === order.time[0]}" v-for="time in timeTable" :key="+(time[0]+'').replace(':','')" @click="chooseTime(time)">{{ time[0] }}</div>
        </div>
        <a href="javascript:void(0)" class="arrow" :class="{'arrow_disabled': (currentMonth === monthAmount && order.date.getDate() === month.end && dayPart === 3) || loadingTime}" @click="changeDayPart(dayPart + 1)"></a>
      </div>
      <div class="time-table__info">
        <div class="time-table__reserved" v-if="order.time.length">
          Бронирование столика с&nbsp;
          <span>{{ order.time[0] }}</span>
        </div>
        <div class="time-table__engaged" v-if="!timeTable.filter(el => el[1] >= order.amountOfPeople).length && !order.time.length">
          <span>!</span>
          Все столики заняты
        </div>
      </div>
    </div>
    <Loader v-else />
  </div>

</template>

<script>

    import Loader from '@/components/Loader';
    import { mapState } from 'vuex'
    import vars from '@/vars.js'

    export default {
        name: "TimeTable",
        components: {
            Loader
        },
        data () {
            return {
                currentDate: new Date(),
                monthAmount: vars.monthAmount
            }
        },
        computed: {
            ...mapState(['dayPart', 'order', 'loadingTime', 'currentMonth']),
            month () {
                return {
                    name: new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + this.currentMonth).toLocaleString("ru", {month: 'long'}),
                    start: new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + this.currentMonth, 1).getDay(),
                    end: new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + this.currentMonth + 1, 0).getDate()
                }
            },
            timeTable () {
                return  this.$store.state.timeTable.slice(this.dayPart*12, (this.dayPart+1)*12).filter(el => el[1] !== null)
            },
            title () {
                let title = ''
                switch (this.dayPart) {
                    case 0:
                        title = 'Ночь'
                        break
                    case 1:
                        title = 'Утро'
                        break
                    case 2:
                        title = 'День'
                        break
                    case 3:
                        title = 'Вечер'
                        break
                }
                return title
            }
        },
        methods: {
            changeDayPart (payload) {
                this.$store.dispatch('changeDayPart', payload)
                // parent.window.postMessage(`height${document.getElementById('zabeiApp').offsetHeight}`, "*");
            },
            chooseTime (payload) {
                this.$store.commit('chooseTime', payload)
            }
        }
    }
</script>

<style scoped lang="scss">
  .time-table {
    min-height: 210px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    &__inner {
      padding-bottom: 50px;
    }
    &__content {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 -10px;
    }

    &__table {
      flex: 1 1 auto;
      margin: 0 10px;

      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: 36px;
      grid-auto-rows: 36px;
      grid-gap: 15px;
    }

    &__time {
      border: 0.5px solid $white;
      box-sizing: border-box;
      border-radius: 4px;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      font-weight: 300;
      font-size: 14px;
      line-height: 14px;

      text-align: center;
      letter-spacing: -0.015em;

      color: $white;
      cursor: pointer;

      transition: color .3s linear, border-color .3s linear;
      
      &_inactive {
        pointer-events: none;
        cursor: default;
        color: $gray-1;
        border-color: $gray-1;
      }

      &_active {
        background: $red;
        box-shadow: 0px 0px 10px $red;
        border-radius: 4px;
        border-color: $red;
      }
    }

    .arrow {
      width: 11px;
      max-width: 11px;
      flex: 0 0 11px;
      height: 20px;
    }

    &__title {
      margin: 15px 0;
      font-weight: 600;
      font-size: 12px;
      line-height: 12px;

      text-align: center;
      letter-spacing: 0.02em;

      color: $gray-1;

      text-transform: uppercase;
    }

    &__info {
      margin-top: 20px;
      text-align: center;
    }

    &__reserved {
      font-weight: 300;
      font-size: 10px;

      text-align: center;
      letter-spacing: -0.015em;

      color: $white;

      span {
        font-weight: 700;
      }
    }

    &__engaged {
      font-weight: 500;
      font-size: 12px;
      line-height: 18px;

      letter-spacing: -0.015em;

      color: $red;
      display: flex;
      align-items: center;
      justify-content: center;

      span {
        margin-right: 10px;
        width: 12px;
        height: 12px;
        max-width: 12px;
        flex: 0 0 12px;
        border-radius: 50%;
        background: $red;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 9px;
        line-height: 18px;

        text-align: center;
        letter-spacing: -0.165px;

        color: $white;
      }
    }
  }
</style>