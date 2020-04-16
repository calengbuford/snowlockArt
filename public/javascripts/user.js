var app = new Vue({
  el: '#art-user',
  data: {
    artPieces: [],
    artPieces1: [],
    artPieces2: [],
  },
  created() {
    console.log("in created()");
    this.getArtPieces();
  },
  methods: {
    async getArtPieces() {
      console.log('in getArtPieces()');
      try {
        let response = await axios.get("/api/artPieces");
        this.artPieces = response.data;
        this.artPieces = this.artPieces.sort((a, b) => (a.order < b.order) ? 1 : -1);
        this.sortArt();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    sortArt() {
      for (let i = 0; i < this.artPieces.length-1; i++) {
        if (i % 2 == 0) {
          this.artPieces1.push(this.artPieces[i]);
        }
        else {
          this.artPieces2.push(this.artPieces[i]);
        }
      }
      this.artPieces2.push(this.artPieces[this.artPieces.length-1]); // To counter imbalance of images displayed
    },
    
    showModal(id) {
      document.getElementById(id).style.display = 'block';
    },
    hideModal(id) {
      document.getElementById(id).style.display = 'none';
    },
  }
});