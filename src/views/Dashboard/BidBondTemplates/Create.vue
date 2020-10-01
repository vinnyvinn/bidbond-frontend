<template>
    <div>
        <h4>Create a new bid bond template.</h4>
        <hr>
        <div class="row">
            <div class="col-md-8">
                <div v-html="$error.handle(error)"></div>
                <div class="form-group">
                    <label>Template Name</label>
                    <input type="text" class="form-control" v-model="name">
                </div>
                <div class="form-group">
                    <tinymce id="one" htmlClass="large_editor" :other_options="editor_options" v-model="my_data" />
                </div>
                <div class="form-group">
                    <a href="#" @click.prevent="submit" class="btn btn-primary">Save</a>
                </div>
            </div>
            <div class="col-md-4">
                <div class="variables">
                    <h4>What you can use</h4>
                    <table class="table table-bordered">
                        <tbody>
                        <tr v-for="(variable, definition) in variables">
                            <td>
                                <a href="#" :id="variable" @click.prevent="copyVariable(variable)" title="copy" class="copy"><i class="fa fa-copy"></i></a>
                                {{ definition }}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import tinymce from 'vue-tinymce-editor'

    export default {
        mounted() {
            this.init();
        },

        components: {
            tinymce
        },

        data() {
            return {
                my_data: {},
                editor_options: {
                    height: '400px',
                    file_picker_types: 'image',
                    /* and here's our custom image picker*/
                    file_picker_callback: function (cb, value, meta) {
                        var input = document.createElement('input');
                        input.setAttribute('type', 'file');
                        input.setAttribute('accept', 'image/*');
                        var _this = this;
                        input.onchange = function () {
                            var file = this.files[0];

                            var reader = new FileReader();

                            reader.onload = () => {
                                var id = 'blobid' + (new Date()).getTime();
                                var blobCache =  _this.editorUpload.blobCache;
                                var base64 = reader.result.split(',')[1];
                                var blobInfo = blobCache.create(id, file, base64);
                                blobCache.add(blobInfo);

                                cb(blobInfo.blobUri(), { title: file.name });
                            };

                            reader.readAsDataURL(file);
                        };

                        input.click();
                    }
                },
                variables: [],
                name: '',
                error: ''
            }
        },

        methods: {
            init() {
                axios.get('/api/v1/bid-bond-templates/create').then(response =>{
                    this.variables = response.data;
                });
            },

            copyVariable(val) {
                var to_copy = '{{ $' + val + ' }}';
                var input = document.createElement('input');
                input.setAttribute('type', 'text');
                input.setAttribute('value', to_copy);
                input.setAttribute('id', 'temporary_input');
                var clicked = document.getElementById(val);
                clicked.prepend(input);
                input.focus();
                input.select();
                document.execCommand('copy');
                document.getElementById('temporary_input').remove();
                var msg = document.createElement('span');
                msg.setAttribute('id', 'show_copied');
                msg.innerHTML = 'Copied';
                clicked.append(msg);

                setTimeout(() => {
                    msg.remove();
                }, 2000);
            },

            submit() {
                let data = {
                    name: this.name,
                    content: this.my_data
                };

                axios.post('/api/v1/bid-bond-templates', data).then(response =>{
                    this.$router.push({ name: 'bid-bond-templates.show', params: { id: response.data.data.secret}});
                }).catch(error => {
                    this.error = error.response;
                });
            }
        }
    }
</script>

<style lang="scss">
    .copy {
        i {
            margin-right: 10px;
        }
    }

    #show_copied {
        background: #404040;
        color: #fff;
        padding: 5px;
        top: 15px;
    }
</style>