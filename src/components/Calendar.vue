<template>

  <div class="calendar">
    <div class="calendar__empty" v-for="offset in (month.start === 0 ? 6 : month.start-1)" :key="offset+40"></div>
    <div class="calendar__day" :class="{'calendar__day_disabled': currentDate.getDate() > day && !currentMonth, 'calendar__day_active': order.date !== null && day === order.date.getDate() && currentDate.getMonth() + currentMonth === order.date.getMonth()}" v-for="day in month.end" :key="day" @click="chooseDate(day)">{{ day }}</div>
  </div>

</template>

<script>
    export default {
        name: "Calendar",
        props: {
            month: {
                type: Object,
                required: true
            }
        },
        data () {
            return {
                currentDate: new Date()
            }
        },
        computed: {
            currentMonth () {
                return this.$store.state.currentMonth
            },
            order () {
                return this.$store.state.order
            }
        },
        methods: {
            chooseDate (day) {
                this.$store.dispatch('chooseDate', day)
            }
        }
    }
</script>

<style scoped lang="scss">

  .calendar {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: 24px;
    grid-auto-rows: 24px;
    grid-gap: 8px;
    margin-top: 30px;
    justify-items: center;

    &__day {
      border: 0.7px solid $white;
      box-sizing: border-box;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      max-width: 31px;
      width: 31px;
      flex: 0 0 31px;

      cursor: pointer;
      font-size: 13px;
      line-height: 13px;
      text-align: center;
      letter-spacing: 0.04em;
      color: $white;

      transition: border-color .3s linear, background-color .3s linear, box-shadow .3s linear;

      &_disabled {
        border-color: $gray-1;
        color: $gray-1;
        pointer-events: none;
        cursor: default;
      }

      &_active {
        background: $red;
        box-shadow: 0px 0px 10px $red;
        border-radius: 4px;
        border-color: $red;
      }
    }

    &__empty {
      pointer-events: none;
      user-select: none;
      opacity: 0;
    }
  }
</style>