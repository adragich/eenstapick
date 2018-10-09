$(function () {
    // VueRangedatePicker.default.install(Vue);
    const app = new Vue({
        el: '#app',
        data: {
            apiCredentials: {
                user: 'womenintech2018',
                password: '2DcdCZnTfj'
            },
            api: {
                getHotels: 'http://nastenaliv.temp.swtest.ru/booking/getHotels/',
                getHotelsByTags: 'http://nastenaliv.temp.swtest.ru/booking/getHotelsByTag/',
                //tag string in get parameters
                getConnectedTags: ''
            },
            loading: false,
            tagState: 'modal hid',
            tags: [
                {
                    label: 'Cozy'
                },
                {
                    label: 'Castle'
                },
                {
                    label: 'Delicious'
                },
                {
                    label: 'Beach'
                },
                {
                    label: 'Delicious'
                },
                {
                    label: 'Beach'
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
            cities: [],
            // currentCity: null,
            currentCity: {id: 1},
            search: {
                autocomplete: '',
                dateRange: '',
                date: {
                    start: '',
                    end: ''
                },
                custom: ''
            },
            selectedTags: [
                {
                    label: 'Delicious'
                },
                {
                    label: 'Beach'
                },
                {
                    label: 'Cozy'
                },],
            suggested: [],
        },
        mounted() {
            this.userLang = navigator.language || navigator.userLanguage;
        },
        methods: {
            getNiceTagsString(){
                let last = this.selectedTags.length - 1,
                    comaArray = this.selectedTags.slice(0, last);
                    str = comaArray.map(el => {
                        return el.label;
                    }).join(', ');
                return str + ' and ' + this.selectedTags[last].label;
            },
            chunkedItems (array) {
                var i, j, temparray, chunk = 2, arr = [];
                for (i = 0, j = array.length; i < j; i += chunk) {
                    temparray = array.slice(i, i + chunk);
                    arr.push(temparray);
                }
                return arr;
            },
            //todo implement API
            //todo work at sort algorithm
            //todo set up datepicker
            autocomplete(close){
                try {
                    if (!!close) this.search.autocomplete = '';
                    if (this.search.autocomplete.length > 2) {
                        $.get({
                            beforeSend: (xhr) => {
                                xhr.setRequestHeader("Authorization", "Basic " + btoa(this.apiCredentials.user + ":" +
                                        this.apiCredentials.password));
                            },
                            url: 'https://distribution-xml.booking.com/2.0/json/autocomplete?text=' + this.search.autocomplete + '&language=' + this.userLang
                        }).done((res) => {
                            this.cities = res.result;
                        }).fail((res)=> {
                            console.log(res);
                        });
                    }
                    else if (this.search.autocomplete.length == 0) {
                        this.cities = [];
                    }
                } catch (e) {
                    console.error(e);
                }
            },
            //{status: '', result: [], tags: []}
            getHotels(city, tags) {
                try {
                    if (!city) return;

                    this.loading = true;
                    let url;
                    if (!tags) {
                        url =  this.api.getHotels + '?id=' + city.id;
                        this.currentCity = city;
                    }
                    else {
                        this.tagState = 'modal hid';
                        url =  this.api.getHotelsByTags + '?id=' + city.id + '&tags=' + this.selectedTags.map(el=> {
                                return el.label;
                            }).join(',');
                    }

                    console.log(url);
                    $.get({
                        url: url
                    }).done((res) => {
                        this.results = res.result;
                        this.loading = false;
                        Vue.nextTick(()=> {
                            this.tagState = 'modal';
                        });
                    }).fail((res)=> {
                        console.log(res);
                        this.loading = false;
                    });
                } catch (e) {
                    console.error(e);
                }
            },
            suggestTag(){
                try {
                    let suggested = [];
                    for (let i = 0; i < this.wordsLibrary.length; i++) {
                        if (suggested.length > 4 || this.search.custom === '') break;
                        var el = this.wordsLibrary[i];
                        if (el.startsWith(this.search.custom)) suggested.push(el);

                    }
                    this.suggested = suggested;
                } catch (e) {
                    console.error(e);
                }
            },
            //tags parameter get request
            //{status: '', result: []}
            getResultsByTags(){

            },
            sortResults(tag) {

            },
            toggleTag(tag){
                try {
                    let index = this.selectedTags.indexOf(tag),
                        selected = index > -1;

                    if (this.selectedTags.length > 2 && !selected) return;

                    if (!selected) this.selectedTags.push(tag);
                    else {
                        console.log(index);
                        this.selectedTags.splice(index, 1);
                    }
                    Vue.set(tag, 'selected', !selected)
                } catch (e) {
                    console.error(e);
                }
            },
            onDateSelected: function (daterange) {
                Vue.set(this.search, 'dateRange', daterange);
            },
            addTag() {
                if (this.search.custom === '') return;
                let tag = {
                    label: this.search.custom,
                    selected: true
                };
                this.tags.push(tag);
                this.selectedTags.push(tag);
            },
            sort: function (key) {
                this.$refs.cpt.sort(key);
            },
            filter: function (key) {
                this.$refs.cpt.filter(key);
            },
            removeTag(tag){
                let i = this.selectedTags.indexOf(tag);
                this.tags.splice(this.tags.indexOf(tag), 1);
                if (i > -1)
                    this.selectedTags.splice(i, 1);

                if (this.tags.length == 0) this.tagState = 'modal hid';
            }
        }
    });
});
