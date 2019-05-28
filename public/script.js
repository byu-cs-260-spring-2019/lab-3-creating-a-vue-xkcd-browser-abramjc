
Vue.component('star-rating', VueStarRating.default);

let app = new Vue({
  el: '#app',
  data: {
    number: '',
    current: {
      title: '',
      img: '',
      alt: ''
    },
    loading: true,
    max: '',
    addedName: '',
    addedComment: '',
    comments: {},
    ratings: {},
    averageRating: 'No Rating',


  },
  created() {
    this.xkcd();
  },
  methods: {
    async xkcd() {
      try {
        this.loading = true;
        const response = await axios.get('https://xkcd.now.sh/' + this.number);
        this.current = response.data;
        this.loading = false;
        this.number = response.data.num;
      } 
      catch (error) {
        console.log(error);
      }

      if (this.ratings !== undefined && this.ratings[this.number] !== undefined && this.ratings[this.number].sum !== undefined) {
        this.averageRating = this.ratings[this.number].sum / this.ratings[this.number].total;
      }
    },

    previousComic() {
      this.number = this.current.num - 1;
      if (this.number < 1) {
          this.number = 1; 
      }
    },

    nextComic() {
      this.number = this.current.num + 1;
      if (this.number > this.max) {
          this.number = this.max;
      }
    },

    getRandom(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum and minimum are inclusive
    },
    randomComic() {
      this.number = this.getRandom(1, this.max);
    },

    addComment() {
      if (!(this.number in this.comments))
        Vue.set(app.comments, this.number, new Array);

      let date = new Date();
      let options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      
      let formattedDate = date.toLocaleTimeString('en-us', options);
      this.comments[this.number].push({
        author: this.addedName,
        text: this.addedComment,
        date: formattedDate,
      });
      this.addedName = '';
      this.addedComment = '';
    },

    firstComic() {
        this.number = 1;
    },

    lastComic() {
        this.number = this.max;
    },

    setRating(rating) {
        if (!(this.number in this.ratings))
            Vue.set(this.ratings, this.number, {
                sum: 0,
                total: 0
            });

        Vue.set(this.ratings, this.number, {
            sum: this.ratings[this.number].sum + rating,
            total: this.ratings[this.number].total + 1,
        });

        if (this.ratings !== undefined && this.ratings[this.number] !== undefined && this.ratings[this.number].sum !== undefined) {
            this.averageRatings = this.ratings[this.number].sum / this.ratings[this.number].total;
        }
    },

  },

  computed: {
      month() {
        var month = new Array;
        if (this.current.month === undefined)
          return '';
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";
        return month[this.current.month - 1];
      },
              
  },

  watch: {
      number(value, oldValue) {
          if (oldValue === '') {
              this.max = value;
          }
          else {
              this.xkcd();
          }
      },
  },
});
