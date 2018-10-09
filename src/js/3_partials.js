//todo sort on client side
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
            tags: [],
            results: [],
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
            selectedTags: [],
            suggested: [],
            showDummyHotel: false,
            showThanks: false
        },
        mounted() {
            this.userLang = navigator.language || navigator.userLanguage;
        },
        methods: {
            shorten(str, n) {
              if(str.length <= n) return str;
              else {
                  return str.substr(0, n) + '...';
              }
            },
            getNiceTagsString(){
                if(this.selectedTags.length > 0) {
                    let firstUp = (label) => {
                            return label.charAt(0).toUpperCase() + label.substr(1)
                        },
                        last = this.selectedTags.length - 1,
                        comaArray = this.selectedTags.slice(0, last);
                    let str = comaArray.map(el => {
                        return firstUp(el.label);
                    }).join(', ');

                    if(this.selectedTags.length > 1) str += ' and';

                    return str + ' ' + firstUp(this.selectedTags[last].label);
                } else return '';
            },
            chunkedItems (array) {
                var i, j, temparray, chunk = 2, arr = [];
                for (i = 0, j = array.length; i < j; i += chunk) {
                    temparray = array.slice(i, i + chunk);
                    arr.push(temparray);
                }
                return arr;
            },
            autocomplete(close){
                try {
                    if (!!close) this.search.autocomplete = '';
                    if (this.search.autocomplete.length > 2) {
                        this.selectedTags = [];
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
                    this.cities = [];
                    let url;
                    if (!tags) {
                        url =  this.api.getHotels + '?id=' + city.id;
                        this.currentCity = city;
                    }
                    else {
                        this.tagState = 'modal hid';
                        url =  this.api.getHotelsByTags + '?id=' + city.id + '&tags=' + this.selectedTags.map(el=> {
                                return el.label.toLowerCase();
                            }).join(',');
                    }

                    $.ajax({
                        method: 'GET',
                        url: url
                    }).done((data) => {
                        let res = JSON.parse(data);
                        if(res.status == 'ok') {
                            this.results = res.result;
                            this.tags = res.tags;
                            this.loading = false;
                            Vue.nextTick(()=> {
                                if(!tags) {
                                    setTimeout(() => {
                                        this.tagState = 'modal';
                                    }, 3000);
                                }
                            });
                        }
                        else {
                            console.log(res);
                        }
                    }).fail((res)=> {
                        console.log(res);
                        this.loading = false;
                    });
                } catch (e) {
                    console.error(e);
                }
            },
            sortedHotels(){
                if(this.selectedTags.length == 0) return this.results;
                else {
                    let sorted = [],
                        tags = this.selectedTags.map(el => { return el.label});

                    this.results.forEach(el=>{
                        var resTags = el.tags.join(','), check = true;
                        for(let i = 0; i < tags.length; i++) {
                            check = resTags.indexOf(tags[i]) > -1;
                            if(!check) break;
                        }
                        if(!!check) sorted.push(el);
                    });

                    return sorted;
                }
            },
            getHotelsByTags(){
                this.tagState = 'modal hid';
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
            sortResults(tag) {

            },
            setTags(tag){
                this.selectedTags = [tag];
                this.tags.forEach(el=>{
                    if(el.label != tag.label) Vue.set(el, 'selected', false);
                })
            },
            toggleTag(tag){
                try {
                    let index = this.selectedTags.indexOf(tag),
                        selected = index > -1;

                    if (this.selectedTags.length > 2 && !selected) return;

                    if (!selected) this.selectedTags.push(tag);
                    else {
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
            // addTag() {
            //     if (this.search.custom === '') return;
            //     let tag = {
            //         label: this.search.custom,
            //         selected: true
            //     };
            //     this.tags.push(tag);
            //     this.selectedTags.push(tag);
            // },
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
            },
            zeros(n){
                if(n.toString().indexOf('.') == -1) return n + ',0';
                else return n.toString().replace('.', ',');
            },
            randomPrice(){
                return (Math.floor(Math.random() * 6) + 9) * 100;
            }
        }
    });
});
