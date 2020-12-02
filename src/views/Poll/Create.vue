<template>
  <main>
    <Header></Header>
    <div class="container">
      <div class="card poll-card-create">
        <div class="card-title">
          <div class="card-title-text">Poll Title</div>
          <textarea
            @keydown="adjustInput($event)"
            type="text"
            v-model="poll.title"
            class="textbox-primary"
            placeholder="Type the title..."
          ></textarea>
        </div>
        <div class="card-content">
          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              @keydown="adjustInput($event)"
              class="textbox"
              v-model="poll.description"
              name="description"
              id="description"
            ></textarea>
          </div>
          <div class="form-group">
            <label for="deadline">Deadline</label>
            <input 
              class="textbox" 
              type="datetime-local" 
              name="deadline" 
              id="deadline"
              v-model="poll.deadline"
            >
          </div>
          <div class="form-group">
            <label for="choices" class="choice-label">Choice</label>
            <div class="choice-list">
              <div
                class="choice"
                v-for="(choice, index) in poll.choices"
                :key="index"
              >
                <input
                  @keydown="addChoice(index)"
                  type="text"
                  name="choice"
                  :id="`choice-${index + 1}`"
                  class="textbox"
                  v-model="poll.choices[index]"
                  :placeholder="`Add Choice ${index + 1}`"
                />
                <div class="choice-remove-icon" @click="removeChoice(index)">
                  <i class="fas fa-times"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <div class="card-footer-action">
            <router-link to="/" class="btn-cancel" href="#">Cancel</router-link>
            <Button>Create Poll</Button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import Header from "@/components/Header.vue";
import Button from "@/components/Base/Button.vue";

export default {
  components: {
    Header,
    Button,
  },
  data() {
    return {
      poll: {
        title: "",
        description: "",
        deadline: "",
        choices: [
          "",
          "",
          "",
        ],
      },
    };
  },
  methods: {
    adjustInput(e) {
      let interval;

      clearInterval(interval)
      interval = setTimeout(() => {
        let el = e.target;
        el.style.height = "1px";
        el.style.height = `${5 + el.scrollHeight}px`;
      }, 50)

      // let height = (el.scrollHeight > el.clientHeight) ? el.scrollHeight : 55;
      // el.style.height = `${height}px`
    },
    addChoice(index) {
      if(this.poll.choices.length-1 == index) {
        if (
          this.poll.choices[this.poll.choices.length-1] !== "" || 
          this.poll.choices[index] == ""
        ) this.poll.choices.push("");
      }
    },
    checkEmpty(e, index) {
      if (e.target.value == "") this.poll.choices.splice(index, 1);
    },
    removeChoice(index) {
      let isEmpty = this.poll.choices.every(choice => choice != "");
      if (this.poll.choices.length <= 3) {
        if(!isEmpty) {
          alert('Semua choice harus disini')
          return;
        }
        alert("Minimal 3 Choices");
        return;
      }
      this.poll.choices.splice(index, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  textarea {
    overflow-y: hidden;
  }
  .card-title {
    textarea {
      height: 39px;
    }
  }
  .card-content {
    textarea {
      padding: 10px 15px;
      height: 52px;
      resize: none;
      line-height: 1.7;
      font-weight: 500;
    }
    label {
      color: #757575;
      font-weight: 600;
    }
    .choice-label {
      margin: {
        bottom: 5px;
        top: 10px;
      }
    }
    .choice-list {
      .choice {
        &:last-child {
          input {
            border-bottom: none;
          }
        }
        display: flex;
        input {
          flex: 5;
          border: none;
          border-radius: 0;
          border-bottom: 1px solid #ccc;
          transition: 0.3s;
          &::placeholder {
            opacity: 0.6;
          }
          padding: 15px 0;
          &:focus {
            border-color: $primary;
          }
        }
        .choice-remove-icon {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 18px;
          cursor: pointer;
          color: $gray;
          transition: 0.3s;
          &:hover {
            color: $red;
          }
        }
      }
    }
  }
}
</style>
