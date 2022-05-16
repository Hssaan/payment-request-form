<template>
  <div class="step-wizard container">
    <div class="step-header">
      <div class="step-progress">
        <div class="bar progressbar" :style="{ width: progress + '%' }">
        </div>
      </div>
      <!-- <ul class="step-pills">
            <li @click.prevent.stop="selectTab(index)" class="step-item" :class="{ 'active': tab.isActive, 'validated': tab.isValidated }" v-for="(tab, index) in tabs" v-bind:key="`tab-${index}`">
                <a class="step-link" href="#">
                        <span class="tabStatus">{{index+1}} </span> 
                        <span class="tabLabel">{{tab.title}}</span>
                </a>
            </li>
        </ul> -->
    </div>
    <div class="step-body mt-5">
      <form>
        <slot></slot>
      </form>
    </div>
    <div class="step-footer mt-1">
      <div class="btn-group" role="group">
        <template v-if="!submitSuccess">
          <button @click="previousTab" v-show="currentTab > 0"
            class="step-button step-button-previous">عودة</button>
          <button @click="nextTab" v-if="currentTab < totalTabs - 1"
            class="step-button step-button-next">التالي</button>
          <button @click="onSubmit" v-if="currentTab === totalTabs - 1"
            class="step-button step-button-submit">إرسال</button>
        </template>
        <template v-else>
          <button @click="reset" class="step-button step-button-reset">Reset</button>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { store } from "./store.js";
export default {
  name: 'form-wizard',
  data() {
    return {
      tabs: [],
      currentTab: 0,
      totalTabs: 0,
      storeState: store.state,
      submitSuccess: false,
      progress: 0,
      isValidationSupport: false
    }
  },
  mounted() {
    this.tabs = this.$children;
    this.totalTabs = this.tabs.length;
    this.currentTab = this.tabs.findIndex((tab) => tab.isActive === true);

    //Select first tab if none is marked selected
    if (this.currentTab === -1 && this.totalTabs > 0) {
      this.tabs[0].isActive = true;
      this.currentTab = 0;
    }

    //Setup Initial Progress
    this.progress = ((this.currentTab + 1) / this.totalTabs * 100);

  },

  updated() {
    /*
      Using this lifehook - since store variable gets updated after component is mounted
      isValidationSupport checks if user is looking to perform validation on each step
    */
    this.isValidationSupport = (Object.keys(this.storeState.v).length !== 0 && this.storeState.v.constructor === Object) ? true : false;
  },

  methods: {
    previousTab() {
      this._switchTab(this.currentTab - 1);

      this.$emit('onPreviousStep');
    },

    nextTab() {

      if (this._validateCurrentTab() === false)
        return;

      this._switchTab(this.currentTab + 1);

      this.$emit('onNextStep');

    },

    reset() {

      this.tabs.forEach(tab => {
        tab.isActive = false;
        tab.isValidated = false;
      });

      this._switchTab(0);
      this.submitSuccess = false;
      this.storeState.v.$reset();

      this.$emit('onReset');
    },

    changeStatus() {
      this.submitSuccess = true;
    },

    selectTab(index) {
      //Only switch to filled previous tabs
      if (index < this.currentTab) {
        this._switchTab(index);
        return;
      }

      if (this._validateCurrentTab() === false) {
        return;
      }

      if (this.tabs[index - 1].isValidated === false) {
        return;
      }

      this._switchTab(index);

    },


    onSubmit() {
      if (this._validateCurrentTab() === false)
        return;
      this.$emit('onComplete');
    },

    _switchTab(index) {
      //Disable all tabs
      this.tabs.forEach(tab => {
        tab.isActive = false;
      });

      this.currentTab = index;
      this.tabs[index].isActive = true;

      this.progress = ((this.currentTab + 1) / this.totalTabs * 100);
    },

    _validateCurrentTab() {
      if (!this.isValidationSupport)  //Check if user wants to validate 
        return true;

      this.storeState.v.$touch();

      if (this.storeState.v.$invalid) {
        this.tabs[this.currentTab].isValidated = false;
        return false;
      }

      this.tabs[this.currentTab].isValidated = true;

      return true;
    }
  },
  watch: {
    currentTab() {
      store.setCurrentTab(this.currentTab);
    }
  }

}
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=El+Messiri:wght@400;500;600;700&display=swap');
*{
  font-family: 'El Messiri', sans-serif;
}
main {
  background-image: linear-gradient(rgb(58 4 77), rgb(226 0 132/58%)), url(../assets/images/img-b01.jpg);
  background-size: cover;
  height: 100vh;
}

label {
  color: white;
}

.form-control,
.form-label{
font-size: 1.5rem !important;
text-align: right;
color:white !important;

}

.form-control::placeholder{
color: rgb(173, 173, 173) !important;
}

.form-control{
background-color: rgb(36 36 36 / 33%) !important;
border-radius: 40px !important;
border:0px !important;

}

.form-control:focus {
    color: #212529;
    background-color: #fff;
    border:0px !important;
    border-color: #86b7fe;
    outline: 0;
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
}

.progressbar {
  transition: width 1s ease;
}

.step-wizard {
  width: 900px;
  margin: auto;
  padding: 40px;
}

.step-progress {
  height: 2rem;
  background: rgb(255 255 255 / 15%);
  border-radius: 1rem;
  margin: 1rem 0rem;
}

.step-progress .bar {
  content: '';
  height: 2rem;
  border-radius: 1rem;
  background-image: linear-gradient(to right, rgb(255 255 255 / 20%), rgb(140 54 151));
}

.step-pills {
  display: flex;
  background-color: white;
  justify-content: space-between;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 .5rem 1rem rgba(0, 0, 0, .15) !important;
}

.step-pills .step-item {
  background-color: #F5F5F5;
  border-radius: 10px;
  padding: 5px 20px;
  list-style-type: none;
  padding: .5rem 1.5rem;
}


.step-pills .step-item a {
  text-decoration: none;
  color: #7B7B7B;
}

.step-pills .step-item.active {
  border: 1px solid #4B8AEB;
}

.step-pills .step-item.validated {
  border: 1px solid #008011;
}

.step-body {
  margin-left: auto;
  padding: 1rem;
  border-radius: 1rem;
}

.step-footer {
  margin-left: auto;
  padding: 1rem;
  border-radius: 1rem;
  margin: 1rem 0rem;
  text-align: center;
}

.step-button {
  font-weight: 700;
  line-height: 1;
  text-transform: uppercase;
  position: relative;
  max-width: 30rem;
  text-align: center;
  border: 0px solid;
  border-radius: 30px;
  color: #22292f;
  color: rgba(34, 41, 47, var(--text-opacity));
  padding: 1rem 3rem;
  font-size: 1.3rem;
  margin: 0.5rem;
  color: #fff;
  outline: none !important;
  background-color: rgb(36 36 36 / 33%) !important;
  transition:all .5s ease-in-out;
 
}

.step-button:hover{
  background-color: rgba(0, 0, 0, 0.40) !important;
}

/** Wizard Ends */
.tabStatus {
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  margin-right: .5rem;
  line-height: 1.5rem;
  color: #fff;
  text-align: center;
  background: rgba(0, 0, 0, 0.38);
  border-radius: 50%;
}

</style>