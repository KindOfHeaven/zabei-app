<template>
  <div class="wrapper" id="zabeiApp">
    <header class="header">
      <h1 class="header__title">Бронирование столика</h1>
      <div class="header__subtitle">{{ subtitle }}</div>
    </header>
    <div class="body">
      <div class="body__step" v-if="currentStep === 0">
        <div class="swiper">
          <div class="arrow arrow_left" :class="{'arrow_disabled': !currentMonth}" @click="changeMonth(currentMonth-1)"></div>
          <div class="swiper__current swiper__current_capitalize">{{ month.name }}</div>
          <div class="arrow" :class="{'arrow_disabled': currentMonth === monthAmount}" @click="changeMonth(currentMonth+1)"></div>
        </div>
        <Calendar :month="month" />
      </div>
      <div class="body__step" v-if="currentStep === 1">
        <div class="amount">
          <div class="amount__title">Кол-во гостей</div>
          <div class="amount__content">
            <div class="round-arrow round-arrow_left" :class="{'round-arrow_disabled': order.amountOfPeople === 1}" @click="checkAmount(order.amountOfPeople - 1)"></div>
            <label for="amountInput" class="amount__input">
              <input type="text" name="amount" :value="order.amountOfPeople" id="amountInput" @focus="$event.target.select()" @change="checkAmount($event.target.value)">
            </label>
            <div class="round-arrow" :class="{'round-arrow_disabled': order.amountOfPeople === maxAmount}" @click="checkAmount(order.amountOfPeople + 1)"></div>
          </div>
        </div>
        <div class="swiper">
          <div class="arrow arrow_left" :class="{'arrow_disabled': (!currentMonth && currentDate.getDate() === order.date.getDate()) || loadingTime}" @click="changeDay(order.date.getDate() - 1)"></div>
          <div class="swiper__current" @click="changeStep(currentStep-1)">{{ order.date.toLocaleString('ru', {month: 'long', day: 'numeric'}) + ', ' + order.date.toLocaleString('ru', {weekday: 'long'}) }}</div>
          <div class="arrow" :class="{'arrow_disabled': (currentMonth === monthAmount && order.date.getDate() === month.end) || loadingTime}" @click="changeDay(order.date.getDate() + 1)"></div>
        </div>
        <TimeTable />
      </div>
      <div class="body__step" v-if="currentStep === 2">
        <div class="result">
          <div class="result__item">
            <div class="result__icon result__icon_calendar"></div>
            <div class="result__text">{{ order.date.toLocaleString('ru', {month: 'long', day: 'numeric'}) }}</div>
          </div>
          <div class="result__item">
            <div class="result__icon result__icon_clock"></div>
            <div class="result__text">{{ order.time[0] }}</div>
          </div>
          <div class="result__item">
            <div class="result__icon result__icon_user"></div>
            <div class="result__text">{{ order.amountOfPeople + ' ' + amount }}</div>
          </div>
        </div>
        <div class="form">
          <Input :input="nameInput" v-model="name" />
          <Input :input="phoneInput" v-model="phone" />
          <Input :input="commentInput" v-model="comment" />
        </div>
      </div>
      <div class="body__step last-step" v-if="currentStep === 3">
        <Loader v-if="loadingTime" />
        <div class="sended" v-else>
          <div class="sended__icon">
<!--            <img src="./assets/images/svg/icon-check.svg" alt="sended">-->
          </div>
          <div class="sended__title">Заявка отправлена!</div>
          <div class="sended__text">Мы свяжемся с вами в ближайшее время</div>
          <a href="javascript:void(0)" class="button button_active" @click.prevent="closeSelf">Закрыть</a>
        </div>
      </div>
    </div>
    <footer class="footer">
      <button v-if="currentStep !== 3" class="button button_back" v-show="!!currentStep" @click="changeStep(currentStep-1)">Вернуться</button>
      <button v-if="currentStep !== 3" class="button" :disabled="disallowNextStep" :class="{'button_active': !disallowNextStep}" @click="changeStep(currentStep+1)">{{ currentStep === 2 ? 'Забронировать' : 'Продолжить' }}</button>
      <div v-if="currentStep === 2" class="form__policy">Нажимая на кнопку “Забронировать”
        вы соглашаетесь <a :href="policyLink">с условиями
          пользовательского соглашения</a></div>
      <div class="footer__copyright" v-if="currentStep > 1">
        <img src="./assets/images/logo.png" alt="Zabei.app">
        <div class="footer__copyright__text">Система бронирования столиков - <a :href="sourceLink" target="_blank">Zabei.app</a></div>
      </div>
    </footer>
    <div class="closer" @click="closeSelf"></div>
  </div>
</template>

<script>

  import Calendar from '@/components/Calendar'
  import vars from '@/vars.js'
  import { mapState } from 'vuex'
  import TimeTable from "@/components/TimeTable";
  import Input from "@/components/Input";
  import Loader from "./components/Loader";

  export default {
    name: 'App',
    components: {
        Loader,
        TimeTable,
        Calendar,
        Input
    },
    data () {
      return {
          currentDate: new Date(),
          monthAmount: vars.monthAmount,
          maxAmount: vars.maxAmount,
          policyLink: vars.policyLink,
          sourceLink: vars.sourceLink,
          phoneInput: {
              type: 'tel',
              id: 'phone',
              name: 'phone',
              placeholder: '+7 (999) 999 99 99',
              required: true,
              label: 'Телефон'
          },
          nameInput: {
              type: 'text',
              id: 'name',
              name: 'name',
              placeholder: 'Иван Иванов',
              required: true,
              label: 'Имя Фамилия'
          },
          commentInput: {
              id: 'comment',
              name: 'comment',
              placeholder: 'Введите сообщение',
              required: false,
              textarea: true,
              label: 'Комментарий'
          },
          name: '',
          phone: '',
          comment: ''
      }
    },
    computed: {
      ...mapState(['currentStep', 'currentMonth', 'order', 'loadingTime','restaurantID', 'loadingWindow']),
      month () {
          return {
              name: new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + this.currentMonth).toLocaleString("ru", {month: 'long'}),
              start: new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + this.currentMonth, 1).getDay(),
              end: new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + this.currentMonth + 1, 0).getDate()
          }
      },
      disallowNextStep () {
          let disallow = true
          switch (this.currentStep) {
              case 0:
                  disallow = this.order.date === null
                  break
              case 1:
                  disallow = !this.order.time.length
                  break
              case 2:
                  disallow = (this.name === '' || this.phone.length < 11)
                  break
              default:
                  break
          }

          return disallow
      },
      subtitle () {
          let text

          switch (this.currentStep) {
              case 0:
                  text = 'Выбор даты'
                  break
              case 1:
                  text = 'Выбор времени'
                  break
              case 2:
                  text = 'Отправка заявки'
                  break
              case 3:
                  text = `${this.order.date.toLocaleString('ru', {month: 'long', day: 'numeric'})} ${this.order.time[0]}, ${this.order.amountOfPeople} ${this.amount}`
                  break
              default:
                  break
          }

          return text
      },
      amount () {
          let ending = 'гост'

          if (this.order.amountOfPeople % 10 === 1 && this.order.amountOfPeople !== 11) {
              ending += 'ь'
          } else if (this.order.amountOfPeople % 10 >= 2 && this.order.amountOfPeople % 10 <= 4 && (this.order.amountOfPeople < 11 || this.order.amountOfPeople > 14)) {
              ending += 'я'
          } else {
              ending += 'ей'
          }

          return ending
      }
    },
    methods: {
      changeMonth (month) {
          this.$store.dispatch('changeMonth', month)
      },
      changeStep (step) {
          this.$store.dispatch('changeStep', step)

          if (step === 3) {
              this.$store.commit('changeLoadingTime', true)
              this.$store.dispatch('sendData', {
                  timeFrom: `${this.order.date.toISOString().slice(0, 10)} ${this.order.time[0]}`,
                  guests: this.order.amountOfPeople,
                  name: this.name,
                  phone: this.phone,
                  comment: this.comment,
              })
          }
      },
      checkAmount (value) {
          let integer = parseInt(value)
          integer = isNaN(integer) ? 2 : integer
          integer = integer > this.maxAmount ? this.maxAmount : integer
          integer = integer < 1 ? 1 : integer
          this.$store.dispatch('changeAmount', integer)
          document.getElementById('amountInput').value = integer

          if (this.$store.state.order.time[1] < integer) {
              this.$store.commit('chooseTime', [])
          }
      },
      changeDay (day) {
          this.$store.dispatch('changeDay', day)
      },
      closeSelf () {
          parent.window.postMessage("close", "*");
      }
    },
    mounted() {
        this.$store.commit('setID', getParameterByName('restaurant-id'))

        function getParameterByName(name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, '\\$&');
            var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, ' '));
        }

        window.addEventListener('load', () => {
            this.$store.commit('changeLoading')
        })
    }
  }
</script>

<style lang="scss">
  html, body {
    background: none;
    height: 100%;
  }

  body {
    display: flex;
    align-items: center;
    justify-content: center;

    @media (max-width: 500px), (max-height: 500px) {
      align-items: flex-start;
    }
  }

  .wrapper {
    width: 320px;
    min-height: 450px;

    background: $general-bg;
    border-radius: 10px;
    padding-bottom: 30px;
    position: relative;
    overflow: hidden;
    @media (max-width: 500px), (max-height: 500px) {
      width: 100%;
      height: auto;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      max-width: 400px;
    }

    @media (max-width: 500px) {
      border-radius: 10px 10px 0 0;
    }

    @media (max-height: 500px)  {
      border-radius: 10px;
    }
  }

  .inner {
    width: 100%;
    flex: 0 0 100%;
  }

  .header {
    background: $header-bg;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
    border-radius: 2px;
    height: 80px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    padding: 20px 0;

    &__title {
      font-weight: bold;
      font-size: 16px;
      line-height: 18px;

      letter-spacing: -0.015em;

      color: $white;
    }

    &__subtitle {
      font-size: 13px;
      line-height: 16px;

      letter-spacing: -0.015em;

      color: $white;
    }
  }

  .body {
    padding: 30px 25px;
    &__step {
      &.last-step {
        padding-top: 80px;
      }
    }
  }

  .swiper {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &__current {
      font-weight: 600;
      font-size: 16px;
      line-height: 36px;

      text-align: center;
      letter-spacing: -0.015em;
      white-space: nowrap;

      color: $white;
      cursor: pointer;

      &_capitalize {
        font-size: 20px;
        text-transform: capitalize;
        cursor: default;
      }
    }
  }

  .arrow {
    width: 16px;
    flex: 0 0 16px;
    max-width: 16px;
    height: 30px;
    display: block;
    cursor: pointer;
    background: $white;
    transition: background-color .3s linear;
    mask: url('assets/images/svg/icon-arrow.svg') center center/8px 15px no-repeat;

    &_disabled {
      pointer-events: none;
      cursor: default;
      background: $gray-1;
    }

    &_left {
      transform: rotate(180deg);
    }
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;

    &__copyright {
      margin-top: 20px;
      width: 100%;
      flex: 0 0 100%;
      max-width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 27px;
        height: 27px;
        max-width: 27px;
        flex: 0 0 27px;
        margin-right: 7px;

        border: 1px solid #979797;
        border-radius: 5px;
      }
      
      &__text {
        font-weight: normal;
        font-size: 10px;
        line-height: 18px;

        letter-spacing: -0.015em;

        color: #7D7D7D;
        
        a {
          color: #18A0FB;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }

  .button {
    background: $gray-1;
    border-radius: 6px;
    cursor: default;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;

    width: 110px;
    height: 30px;

    font-weight: 500;
    font-size: 11px;
    line-height: 13px;
    text-align: center;
    letter-spacing: -0.015em;

    color: $white;
    border: none;
    outline: none;
    box-shadow: none;

    transition: box-shadow .3s linear, background-color .3s linear, border-color .3s linear;


    &_active {
      background: $red;
      box-shadow: 0px 0px 10px $red;
      border-radius: 4px;
      border-color: $red;
      cursor: pointer;
      pointer-events: auto;
    }

    &_back {
      margin-right: 25px;
      background: none;
      border: 1px solid $white;
      cursor: pointer;
      pointer-events: auto;
    }
  }

  .amount {
    margin-bottom: 35px;

    &__title {
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 15px;

      text-align: center;
      letter-spacing: -0.015em;

      color: $white;
    }
    
    &__content {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    &__input {
      box-sizing: border-box;
      border-radius: 5px;
      width: 50px;
      flex: 0 0 50px;
      max-width: 50px;
      height: 37px;
      text-align: center;
      margin: 0 10px;
      border: 1px solid transparent;
      transition: border-color .3s linear;
      cursor: pointer;

      &:hover {
        border: 1px solid $red;
      }

      input {
        width: 100%;
        height: 100%;
        display: block;
        box-shadow: none;
        border: none;
        outline: none;
        background: none;
        -webkit-appearance: none;
        text-align: center;

        font-weight: normal;
        font-size: 20px;
        line-height: 24px;

        letter-spacing: -0.015em;

        color: #FFFFFF;


        &::selection {
          background: rgba(216, 102, 96, 0.3);
        }
      }
    }
  }
  
  .round-arrow {
    width: 34px;
    max-width: 34px;
    flex: 0 0 34px;
    height: 34px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    border: 1px solid $red;
    transition: border-color .3s linear;
    cursor: pointer;

    &:after {
      content: '';
      display: block;
      background: $red;
      transition: background-color .3s linear;
      mask: url('assets/images/svg/icon-arrow.svg') center center/8px 15px no-repeat;
      width: 8px;
      max-width: 8px;
      flex: 0 0 8px;
      height: 15px;
    }

    &_left {
      transform: rotate(180deg);
    }

    &_disabled {
      pointer-events: none;
      user-select: none;
      border-color: $gray-1;
      &:after {
        background: $gray-1;
      }
    }
  }

  .result {
    border: 0.5px solid $gray-1;
    box-sizing: border-box;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 35px;
    padding: 0 15px;

    &__item {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }

    &__icon {
      margin-right: 10px;

      &_calendar {
        width: 13px;
        height: 13px;
        max-width: 13px;
        flex: 0 0 13px;
        mask: url("assets/images/svg/icon-calendar.svg") 0 0/13px 13px no-repeat;
        background: $white;
      }
      &_clock {
        width: 12px;
        height: 12px;
        max-width: 12px;
        flex: 0 0 12px;
        mask: url("assets/images/svg/icon-clock.svg") 0 0/12px 12px no-repeat;
        background: $white;
      }
      &_user {
        width: 10px;
        height: 10px;
        max-width: 10px;
        flex: 0 0 10px;
        mask: url("assets/images/svg/icon-user.svg") 0 0/10px 10px no-repeat;
        background: $white;
      }
    }

    &__text {
      font-size: 12px;
      line-height: 18px;

      color: $white;
    }
  }

  .form {
    margin: 35px 0;
    width: 100%;
    display: grid;
    grid-template-columns: 100%;
    grid-row-gap: 15px;

    &__policy {
      font-size: 10px;
      line-height: 14px;

      text-align: center;
      letter-spacing: -0.015em;

      color: #7D7D7D;
      padding: 0 60px;
      margin-top: 10px;
      
      a {
        color: #18A0FB;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  
  .sended {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    &__icon {
      width: 60px;
      max-width: 60px;
      height: 60px;
      flex: 60px;
      background: #212121;
      border-radius: 50%;
      box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
      margin-bottom: 10px;

      display: flex;
      align-items: center;
      justify-content: center;

      &:after {
        content: '';
        display: block;
        height: 25px;
        width: 33px;
        max-width: 33px;
        flex: 0 0 33px;
        background: url("assets/images/svg/icon-check.svg") 0 0/33px 25px no-repeat;
      }
    }

    &__title {
      font-weight: 600;
      font-size: 14px;
      line-height: 36px;

      text-align: center;
      letter-spacing: -0.015em;

      color: $white;
    }

    &__text {
      max-width: 135px;
      margin-bottom: 50px;

      font-weight: 300;
      font-size: 12px;
      line-height: 18px;

      text-align: center;
      letter-spacing: -0.015em;

      color: $white;
    }
  }

  .closer {
    position: absolute;
    z-index: 3;
    width: 15px;
    height: 15px;
    right: 10px;
    top: 16px;
    cursor: pointer;
    transform: rotate(45deg);
    transform-origin: center center;
    display: flex;
    align-items: center;
    justify-content: center;

    &:after {
      content: '';
      display: block;
      height: 15px;
      width: 1px;
      background: #979797;
    }

    &:before {
      content: '';
      display: block;
      width: 15px;
      height: 1px;
      background: #979797;
      position: absolute;
      left: 0;
      top: 7px;
    }
  }
</style>
