$(function(){
    VueRangedatePicker.default.install(Vue);
    const app = new Vue({
        el: '#app',
        data: {
                apiCredentials: {
                    user: 'womenintech2018',
                    password: '2DcdCZnTfj'
                },
                loading: false,
                showTags: false,
                tags: [
                    {
                        label: 'cozy'
                    },
                    {
                        label: 'castle'
                    },
                    {
                        label: 'delicious'
                    },
                    {
                        label: 'beach'
                    },
                ],
                results: [
                    {
                        title: 'Cheap hotel',
                        description: 'Lorem ipsum',
                        thumb: 'images/1.jpg',
                        tags: ['cheap', 'delisious', 'beach']
                    },
                    {
                        title: 'Romantic hotel',
                        description: 'Lorem ipsum',
                        thumb: 'images/2.jpg',
                        tags: ['sights', 'art', 'romantic']
                    },
                    {
                        title: 'Business hotel',
                        description: 'Lorem ipsum',
                        thumb: 'images/3.jpg',
                        tags: ['business', 'castle', 'activities']
                    },
                ],
                search: {
                    autocomplete: '',
                    dateRange: '',
                    date: {
                        start: '',
                        end: ''
                    }
                },
            selectedTags: []
        },
        mounted() {
            // console.log(this.tags);
        },
        methods: {
            //todo implement API
            //todo work at sort algorithm
            //todo set up datepicker
            autocomplete(){

            },
            getResultsByTags(){

            },
            sortResults(tag) {

            },
            toggleModal(selector){

            },
            toggleTag(tag){

            },
            onDateSelected: function (daterange) {
                Vue.set(this.search, 'dateRange', daterange);
            }
        }
    });
});
