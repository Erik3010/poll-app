<template>
  <main>
    <Header></Header>
    <div class="container">
      <div class="poll-card-wrapper">
        <div class="card" v-for="poll in polls" :key="poll.id">
          <div class="card-title">
            <div class="header-profile">
              <div class="header-profile-avatar">E</div>
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
              <div class="poll-choices-list" :ref="`poll-${poll.id}-choices`">
                <label class="poll-choices-list-item" 
                  :for="`option-${choice.id}`" 
                  v-for="choice in poll.choices" :key="choice.id"
                >
                  <div class="poll-choices-list-item-input">
                    <!-- <div class="radio-button-container">
                      <input type="radio" id="option-1" name="choice">
                      <span></span>
                    </div> -->
                    <input 
                      type="radio" 
                      @change="changeChoice(poll.id, choice.id)" 
                      :disabled="isVoted(poll.id)"
                      :id="`option-${choice.id}`" 
                      :name="`option-${poll.id}`"
                    >
                  </div>
                  <div class="poll-choices-list-item-info">
                    <div>{{ choice.choice }}</div>
                    <div class="poll-choices-list-item-info-result" v-if="isVoted(poll.id)">
                      <div class="poll-choices-list-item-info-result-bar" :ref="`choice-bar-poll-${poll.id}-choice-${choice.id}`">
                        <div class="poll-choices-list-item-info-result-bar-fill"></div>
                      </div>
                      <div class="poll-choices-list-item-info-result-score" :ref="`choice-bar-text-poll-${poll.id}-choice-${choice.id}`"></div>
                    </div>
                  </div>
                </label>
              </div>
            </div> 
          </div>
          <div class="card-footer">
            <!-- <Button :disabled="!choice_id[`poll-${poll.id}`]" :loading="isLoading" @click.native="vote(poll.id)">Vote</Button> -->
            <Button 
              :loading="(choice_id[`poll-${poll.id}`] != undefined && choice_id[`poll-${poll.id}`].loading_btn)"
              :disabled="isVoted(poll.id)"
              @click.native="vote(poll.id)"
            >Vote</Button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import Header from "@/components/Header.vue";
import Button from '@/components/Base/Button.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    Header,
    Button
  },
  data() {
    return {
      current_choice: null,
      choice_id: [],
      isLoading: false,
      choice_ready: false
    }
  },
  mounted() {
    this.$store.dispatch('poll/fetchPolls');
  },
  watch: {
    polls(val) {
      let result = this.polls.map(poll => poll.id)
      result.forEach(res => {
        this.$set(this.choice_id, `poll-${res}`, {choiceId: 0, voted: false, loading_btn: false})
      })
    },
    current_choice(val) {
      const { pollId, choiceId } = val;
      this.$set(this.choice_id[`poll-${pollId}`], 'choiceId', choiceId)
    },
    choice_id() {
      this.$nextTick(() => {
        if(this.choice_ready) return;
        this.polls.forEach((poll, index) => {
          if(this.isVoted(poll.id)) this.calculateLength(poll);
        })
        this.choice_ready = true;
      })
    }
  },
  computed: {
    ...mapGetters({
      polls: 'poll/getPolls',
      poll: 'poll/getPoll',
      user: 'auth/getUser'
    })
  },
  methods: {
    vote(pollId) {
      let choiceId = this.choice_id[`poll-${pollId}`]
      if(!choiceId.choiceId) {
        alert('Tidak ada pilihan yang terpilih')
        return;
      }
      // this.isLoading = true;
      this.$set(choiceId, 'loading_btn', true)
      this.$store.dispatch('poll/vote', { pollId, choiceId: choiceId.choiceId })
        .then(res => {
          // this.isLoading = false;
          this.$set(choiceId, 'loading_btn', false)
          this.$set(choiceId, 'voted', true);
          this.$store.dispatch('poll/fetchPoll', pollId).then(res => {
            this.calculateLength(res.data, {pollId, choiceId: choiceId.choiceId})
          });
        })
        .catch(err => {
          this.$set(choiceId, 'loading_btn', false)
          // this.isLoading = false;
        })
    },
    changeChoice(pollId, choiceId) {
      this.current_choice = {pollId, choiceId}
    },
    isVoted(pollId) {
      return (this.choice_id[`poll-${pollId}`] && this.choice_id[`poll-${pollId}`].voted) || 
            (this.user.votedPoll && this.user.votedPoll.includes(pollId))
    },
    calculateLength(poll) {
      const choiceListContainer = this.$refs[`poll-${poll.id}-choices`][0];

      let maxPoint = Math.max(...poll.result.map(res => res.point), 0);
      let totalPoint = poll.result.reduce((total, res) => total + +res.point , 0);

      poll.choices.forEach((choice, index) => {
        const choiceBar = this.$refs[`choice-bar-poll-${poll.id}-choice-${choice.id}`][0];
        const choiceText = this.$refs[`choice-bar-text-poll-${poll.id}-choice-${choice.id}`][0];
        const choiceBarFill = choiceBar.querySelector('div');

        const { width } = choiceBar.getBoundingClientRect();

        let choicePoint = poll.result.find(res =>  res.choice_id == choice.id).point;

        let value = this.calculatePercent(choicePoint, totalPoint);

        choiceBarFill.style.width = `${value}%`
        choiceText.innerHTML = `${value}%`;
      })
    },
    isFloat(value) {
      return value % 1 !== 0;
    },
    calculatePercent(value, total) {
      let result = (value / total) * 100
      return this.isFloat(result) ? +result.toFixed(2) : result;
    }
  },
};
</script>

<style lang="scss" scoped>
.poll-card-wrapper {
  display: flex;
  flex-direction: column;
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
              input {
                // margin-right: 12px;
              }
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
}

</style>
