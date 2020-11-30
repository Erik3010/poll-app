<template>
    <button :disabled="loading || disabled" :class="[{ loading: loading }, 'btn']" @click="isLoading = !isLoading">
        <div class="button-wrapper">
            <span><slot /></span>
            <div class="loading-circle"></div>
        </div>
    </button>
</template>

<script>
export default {
    props: ['loading', 'disabled'],
    data() {
        return {
            isLoading: false
        }
    },
}
</script>

<style lang="scss">
.btn {
    background: $primary;
    color: white;
    width: 250px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    font-weight: 700;
    display: inline-block;
    font-size: 16px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 3px 7px -4px rgba(43,53,72,.05), 0 3px 4px -3px rgba(43,53,72,.1);
    transition: .3s ease;
    &:disabled {
        background: $disabled;
        &:hover {
            background: $disabled;
        }
    }
    .button-wrapper {
        position: relative;
        padding: 25px 0;
        * {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
    &:hover {
        background: $primaryHover;
    }
    span {
        display: inline-block;
        transition: .3s ease;
    }
    .loading-circle {
        border-radius: 100%;
        width: 20px;
        height: 20px;
        border: 3px solid #fff;
        margin: auto;
        border-top-color: #a7a7a7;
        transition: .3s ease;
    }
    .loading-circle {
        top: 150%;
    }
    &.loading {
        background: $disabled !important;
        .loading-circle {
            top: 50%;
            animation: loadingButton 1s linear infinite;
        }
        span {
            top: -50%;
        }
    }
    &.btn-danger {
        background: $red;
    }
}
@keyframes loadingButton {
    from {
        transform: translate(-50%, -50%) rotate(0deg)
    }
    to {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}

</style>