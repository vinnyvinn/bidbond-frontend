<template>
    <div>
        <transition name="modal" v-if="showModal">
            <div class="modal-mask">
                <div class="modal-wrapper" @click="close">
                    <div class="modal-container">
                        <div class="modal-header">
                            <slot name="header"></slot>
                            <button type="button" class="close" @click.prevent="$emit('close')">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <slot></slot>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<!--<div class="modal fade">-->
<!--    <div class="modal-dialog" role="document">-->
<!--        <div class="modal-content">-->
<!--            <div class="modal-header">-->
<!--                <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>-->
<!--                <button type="button" class="close" data-dismiss="modal" aria-label="Close">-->
<!--                    <span aria-hidden="true">&times;</span>-->
<!--                </button>-->
<!--            </div>-->
<!--            <div class="modal-body">-->
<!--                ...-->
<!--            </div>-->
<!--            <div class="modal-footer">-->
<!--                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>-->
<!--                <button type="button" class="btn btn-primary">Save changes</button>-->
<!--            </div>-->
<!--        </div>-->
<!--    </div>-->
<!--</div>-->

<script>
    export default {
        props: {
            showModal: {
                type: Boolean,
                default() {
                    return false
                }
            }
        },

        methods: {
            close(e) {
                if (e.target.className == 'modal-wrapper') {
                    this.$emit('close');
                }
            }
        }
    }
</script>

<style lang="scss">
    .modal-mask {
        position: fixed;
        z-index: 99999999;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .6);
        display: table;
        transition: opacity .3s ease;
    }

    .modal-wrapper {
        display: table-cell;
        vertical-align: middle;
    }

    .modal-container {
        width: 600px;
        margin: 40px auto;
        padding: 20px 30px;
        background-color: #fff;
        border-radius: 2px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
        transition: all .3s ease;

        @media(max-width: 768px) {
            width: 80%;
        }
    }

    .modal-body {
        margin: 20px 0;
        overflow-y: auto;
        max-height: 60vh;
    }

    .modal-default-button {
        float: right;
    }

    .modal-close {
        float: right;
    }
     .close{
       font-size: 30px !important;
       color: red;
     }
    /*
     * The following styles are auto-applied to elements with
     * transition="modal" when their visibility is toggled
     * by Vue.js.
     *
     * You can easily play with the modal transition by editing
     * these styles.
     */

    .modal-enter {
        opacity: 0;
    }

    .modal-leave-active {
        opacity: 0;
    }

    .modal-enter .modal-container,
    .modal-leave-active .modal-container {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }
</style>
