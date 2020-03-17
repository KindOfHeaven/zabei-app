<template>

  <label :for="input.id" class="input__label">
    <span class="input__text" v-if="input.label">{{ input.label + (input.required ? '*' : '') }}</span>
    <input v-if="input.type === 'tel'" v-mask="'+7 (###) ### ## ##'" :required="input.required" class="input" :type="input.type" :name="input.name" :id="input.id" :placeholder="input.placeholder" :value="value" @input="$emit('input', $event.target.value.replace(/\D/g, ''))"></input>
    <textarea v-else-if="input.textarea" :name="input.name" :id="input.id" :required="input.required" :placeholder="input.placeholder" :value="value" class="input input_textarea" @input="$emit('input', $event.target.value)"></textarea>
    <input v-else :type="input.type" class="input" :name="input.name" :id="input.id" :required="input.required" :placeholder="input.placeholder" :value="value" @input="$emit('input', $event.target.value)">
  </label>

</template>

<script>

    import { mask } from 'vue-the-mask'
    export default {
        name: "Input",
        directives: {
            mask
        },
        props: {
            input: {
                type: Object,
                required: true
            },
            value: {
                type: String
            }
        }
    }
</script>

<style scoped lang="scss">
  .input {
    &__text {
      font-weight: 600;
      font-size: 10px;
      line-height: 18px;

      letter-spacing: -0.015em;

      color: $white;
      display: block;
    }

    background: #1E1E1E;
    border: 0.5px solid $gray-1;
    box-sizing: border-box;
    border-radius: 3px;
    -webkit-appearance: none;
    outline: none;
    width: 100%;
    height: 30px;

    padding-left: 10px;

    font-weight: 300;
    font-size: 12px;
    line-height: 18px;

    letter-spacing: -0.015em;

    color: $white;
    &::placeholder {
      color: $gray-1;
    }

    &__label {
      width: 100%;
    }

    &_textarea {
      resize: none;
      height: 75px;
      padding-top: 5px;
    }
  }
</style>