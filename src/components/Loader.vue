<template>

  <div class="loader">
      <div class="loader__inner">
        <div class="loader__bar"></div>
      </div>
      <div class="loader__text">Пожалуйста, подождите...</div>
  </div>

</template>

<script>
    export default {
        name: "Loader"
    }
</script>

<style scoped lang="scss">
  .loader {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &__inner {
      width: 50px;
      height: 50px;
      flex: 0 0 50px;
      background: #202020;
      position: relative;
      border-radius: 50%;

      &:after {
        background: $general-bg;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        width: 42px;
        height: 42px;
        display: block;
        content: '';
        position: absolute;
        left: 4px;
        top: 4px;
        border-radius: 50%;
        z-index: 1;
      }
    }

    &__bar {
      width: 50px;
      height: 50px;
      position: absolute;
      top: 0;
      right: 0;
      border-top: 4px solid transparent;;
      border-right: 4px solid transparent;;
      border-bottom: 4px solid transparent;;
      border-left: 4px solid $red;
      background: transparent;
      border-radius: 50%;
      z-index: 2;
      transform-origin: center center;
      animation: 1s linear 0s infinite spin
    }

    &__text {
      margin-top: 20px;
      font-weight: 300;
      font-size: 12px;
      line-height: 22px;

      text-align: center;
      letter-spacing: -0.015em;

      color: #707070;
    }
  }

  @keyframes spin {100% { transform: rotate(-360deg)  }  }
</style>