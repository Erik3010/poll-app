<template>
  <div class="card">
    <div class="card-title">
      <div class="header-profile">
        <div class="header-profile-avatar">{{ initialName(poll.creator) }}</div>
        <div class="header-profile-detail">
            <h4>{{ poll.creator }}</h4>
            <p>{{ poll.created_at | date }}</p>
        </div>
      </div>
    </div>
    <div class="card-content">
      <div class="poll-header">
        <div class="poll-title">
          <span>{{ poll.title }}</span>
          <div class="badge badge-primary poll-deadline">
            <i class="fas fa-clock"></i> 23h left
          </div>
        </div>
      </div>
      <div class="poll-description">
        <div class="poll-description-title">
          <h4>Description</h4>
        </div>
        <p>{{ poll.description }}</p>
      </div>
      <div class="poll-choices">
        <div class="poll-choices-title">
          <h4>Choose your choices</h4>
        </div>
        <div class="poll-choices-list">
          <label class="poll-choices-list-item" 
            v-for="choice in poll.choices" 
            :for="`option-${choice.id}`" 
            :key="choice.id"
          >
            <div class="poll-choices-list-item-input">
              <input 
                type="radio" 
                v-model="choiceChoosed"
                :disabled="isVoted"
                :id="`option-${choice.id}`" 
                :name="`option-${poll.id}`"
                :value="choice.id"
              >
            </div>
            <div class="poll-choices-list-item-info">
              <div>{{ choice.choice }}</div>
              <div class="poll-choices-list-item-info-result" v-if="isVoted">
                <div class="poll-choices-list-item-info-result-bar">
                  <div 
                    class="poll-choices-list-item-info-result-bar-fill" 
                    :ref="`choice-${choice.id}-bar-fill`"
                  ></div>
                </div>
                <div 
                  class="poll-choices-list-item-info-result-score" 
                  :ref="`choice-${choice.id}-bar-text`"
                >0%</div>
              </div>
            </div>
          </label>
        </div>
      </div> 
    </div>
    <div class="card-footer">
      <Button 
        :loading="loading"
        :disabled="isVoted"
        @click.native="vote"
      >Vote</Button>
    </div>
  </div>
</template>

<script>
import Button from '@/components/Base/Button.vue';

export default {
  props: ['poll', 'votedPolls'],
  components: {
    Button
  },
  data() {
    return {
      choiceChoosed: null,
      loading: false,
      pollIsVoted: false,
    }
  },
  computed: {
    isVoted() {
      return (this.votedPolls != undefined && this.votedPolls.includes(this.poll.id))
    }
  },
  mounted() {
    this.calculateResult()
  },
  methods: {
    calculateResult(poll = this.poll) {
      const totalPoint = poll.result.reduce((total, result) => total + result.point, 0);

      this.$nextTick(() => {
        poll.choices.forEach(choice => {
          let choiceBarFill = this.$refs[`choice-${choice.id}-bar-fill`];
          let choiceBarText = this.$refs[`choice-${choice.id}-bar-text`];          

          if(choiceBarFill === undefined && choiceBarText === undefined) return;
          choiceBarFill = choiceBarFill[0];
          choiceBarText = choiceBarText[0];

          let choicePoint = poll.result.find(result => result.choice_id == choice.id).point;

          let point = this.calculatePercent(choicePoint, totalPoint);
          choiceBarFill.style.width = `${point}%`;
          choiceBarText.innerHTML = `${point}%`;
        })
      })
    },
    isFloat(value) {
      return value % 1 !== 0;
    },
    calculatePercent(value, total) {
      let result = (value / total) * 100;
      return this.isFloat(result) ? +result.toFixed(2) : result;
    },
    vote(choiceId) {
      if(!this.choiceChoosed) {
        alert('Please choose a choice');
        return;
      }

      this.loading = true;
      Promise.all([
        this.$store.dispatch('poll/vote', { pollId: this.poll.id, choiceId: this.choiceChoosed }),
        this.$store.dispatch('poll/fetchPoll', this.poll.id)
      ]).then(res => {
        this.votedPolls.push(this.poll.id);
        this.loading = false;
        this.calculateResult(res[1].data)
      })
      .catch(err => {
        this.loading = false;
        console.log(err)
      })
    },
    initialName(username) {
      let initials = username.match(/\b\w/g) || [];
      return (initials = (
        (initials.shift() || "") + (initials.pop() || "")
      ).toUpperCase());
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  padding: 15px 30px;
  max-width: 600px;
  .card-title {
    margin: 0 -30px;
    border-bottom: 1px solid #e6e6e6;
    .header-profile {
      padding: 10px 30px 20px;
    }
  }
  .card-content {
    padding: 10px 0;
    line-height: 1.7;
    .poll-header {
      .poll-title {
        font-size: 28px;
        font-weight: 800;
        color: #2b3548;
      }
      .badge {
        height: 100%;
        margin-left: 15px;
        position: relative;
        top: -3px;
        &.poll-deadline i {
          margin-right: 3px;
        }
      }
    }
    .poll-description {
      &-title {
        color: #757575;
        font-size: 14px;
      }
      font-size: 14px;
      margin: 15px 0 20px;
      color: $gray;
    }
    .poll-choices {
      &-title {
        color: #757575;
        font-size: 14px;
        margin-bottom: 7px;
      }
      &-list {
        margin-top: 5px;
        &-item {
          display: flex;
          width: 100%;
          font-weight: 700;
          margin: 8px 0;
          padding: 10px 20px;
          border: 1px solid #d2d2d2;
          border-radius: 7px;
          cursor: pointer;
          // &.active {
          //   color: white;
          //   background: $primary;
          //   &:hover {
          //     color: white;
          //     background: $primary;
          //   }
          // }
          &:hover {
            background: #f7f7f7;
          }
          &-input {
            // input {
            //   margin-right: 12px;
            // }
            display: flex;
            align-items: center;
            margin-right: 15px;
          }
          &-info {
            width: 100%;
            &-result {
              display: flex;
              justify-content: space-between;
              align-items: center;
              &-bar {
                width: 100%;
                background: #c1c1c1;
                border-radius: 50px;
                height: 10px;
                max-width: 90%;
                overflow: hidden;
                &-fill {
                  background: $primary;
                  width: 0%;
                  height: 100%;
                  transition: .3s ease;
                  box-shadow: 0 0.5rem 0.7rem rgb(16 24 94 / .4);
                  border-radius: 50px;
                }
              }
              &-score {
                width: 10%;
                margin-left: 10px;
              }
            }
          }
        }
      }
    }
  }
  .card-footer {
    display: flex;
    justify-content: flex-end;
    margin: {
      top: 10px;
      bottom: 15px;
    };
    button {
      margin-left: auto;
      max-width: 140px;
    }
  }
}
</style>