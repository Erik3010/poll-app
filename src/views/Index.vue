<template>
  <main>
    <Header></Header>
    <div class="container">
      <div class="poll-card-wrapper">
        <PollCard v-for="poll in polls" :key="poll.id" :poll="poll" :votedPolls="user.votedPoll" />
      </div>
    </div>
  </main>
</template>

<script>
import Header from "@/components/Header.vue";
import PollCard from '@/components/PollCard.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    Header,
    PollCard
  },
  mounted() {
    this.$store.dispatch('poll/fetchPolls');
  },
  computed: {
    ...mapGetters({
      polls: 'poll/getPolls',
      user: 'auth/getUser'
    })
  },
};
</script>

<style lang="scss" scoped>
.poll-card-wrapper {
  display: flex;
  flex-direction: column;
  
}
</style>
