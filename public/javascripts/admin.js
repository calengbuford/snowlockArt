var app = new Vue({
  el: '#art-admin',
  data: {
    authenticated: false,
    username: "",
    password: "",
    adminUser: "",
    
    name: "",
    date: "",
    descript: "",
    price: "",
    order: 0,
    
    artPieces: [],
    commissions: [],
    
    file: null,
    loadingFile: false,
    postFileSelected: false,
    newUpload: null,
    disabled: true,
    
    editFileSelected: false,
    editId: "",
    editArt: null,
    newName: "",
    newDate: "",
    newDescript: "",
    newPrice: "",
    newOrder: 0,
    
    editCommissionSelected: false,
    editCommissionId: "",
    editCommission: null,
    curCommissionName: "",
    curCommissionEmail: "",
    curCommissionPriceRange: "",

    newPostShown: false,
    editPostShown: false,
    portfolioShown: false,
    editCommissionShown: false,
    commissionShown: false,
    siteDesignShown: false,
  },
  computed: {
    disablePost: function() {
      if (this.name === "" || this.date === "" || this.descript === "" || this.price === "" || this.postFileSelected == false) {
        return true;
      }
      return false;
    },
    disableEdit: function() {
      if (/\S/.test(this.editId)) {
        return false;
      }
      return true;
    },
    disableCommissionStart: function() {
      if (/\S/.test(this.editCommissionId)) {
        return false;
      }
      return true;
    }
  },
  methods: {
    ////////////////////////////////////////////////// LOAD PAGE
    showNewPostInfo() {
      this.newPostShown = !this.newPostShown;
    },
    showEditPostInfo() {
      this.editPostShown = !this.editPostShown;
    },
    showPortfolioInfo() {
      this.portfolioShown = !this.portfolioShown;
    },
    showEditCommissionInfo() {
      this.editCommissionShown = !this.editCommissionShown;
    },
    showCommissionInfo() {
      this.commissionShown = !this.commissionShown;
    },
    showSiteDesignInfo() {
      this.siteDesignShown = !this.siteDesignShown;
    },
    async login() {
      console.log('in login()');
      try {
        let response = await axios.get("/api/adminAccounts/" + this.username);
        this.adminUser = response.data;

        // Check if adminUser found the given username in the database
        if (this.adminUser) {
          // Check if the given password matches the password of the database object
          if (this.password == this.adminUser.password) {
            this.authenticated = true;
            this.getArtPieces();
            this.getCommissions();
            return;
          }
        }
        throw "Not authenticated";
      }
      catch (error) {
        console.log(error);
        this.username = "";
        this.password = "";
        this.adminUser = "";
        sweetAlert("Incorrect username or password", "",  "error");
      }
    },
    async getArtPieces() {
      console.log('in getArtPieces()');
      try {
        let response = await axios.get("/api/artPieces");
        this.artPieces = response.data;
        this.artPieces = this.artPieces.sort((a, b) => (a.order < b.order) ? 1 : -1);
        console.log(this.artPieces);
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async getCommissions() {
      console.log('in getCommissions()');
      try {
        let response = await axios.get("/api/commission");
        this.commissions = response.data;
        this.convertDates();
        console.log(this.commissions);
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    convertDates() {
      console.log("in convertDates()");
      for (let comm of this.commissions) {
        let date = new Date(comm.dateReceived);
        comm.dateReceived = (date.getMonth()+1).toString() + "/" + 
                              date.getDate().toString() + "/" + date.getFullYear().toString();
      }
    },
    
    
    ////////////////////////////////////////////////// UPLOAD NEW ART
    async fileChanged(event) {
      console.log("in fileChange");
      this.file = event.target.files[0];
      this.postFileSelected = false,
      this.loadingFile = true;
      try {
        console.log("in try of fileChanged()")
        const formData = new FormData();
        formData.append('photo', this.file, this.file.name)
        let r1 = await axios.post('/api/photos', formData);
        this.newUpload = r1.data;
        this.loadingFile = false;
        this.postFileSelected = true;
      }
      catch (error) {
        console.log(error);
        this.loadingFile = false;
        sweetAlert("File Selection Failed", "",  "error");
      }
    },
    async upload() {
      console.log("in upload");
      try {
        let r2 = await axios.post('/api/artPieces', {
          name: this.name,
          date: this.date,
          descript: this.descript,
          price: this.price,
          path: this.newUpload.path,
          order: this.order,
        });
        sweetAlert("Post Successful!", "",  "success");
        this.postFileSelected = false;
        this.name = "";
        this.date = "";
        this.descript = "";
        this.price = "";
        this.order = 0;
        this.newUpload == null;
        this.getArtPieces();
      }
      catch (error) {
        console.log(error);
        sweetAlert("Post Failed", "",  "error");
      }
    },
    
    
    ////////////////////////////////////////////////// EDIT ART
    async findArtId() {
      console.log("in editId");
      try {
        let response = await axios.get("/api/artPieces/" + this.editId);
        this.editArt = response.data;
        if (!this.editArt) {
          throw "Bad response";
        }
        console.log(this.editArt);
        sweetAlert("Id Found!", "",  "success");
        this.newName = this.editArt.name;
        this.newDate = this.editArt.date;
        this.newDescript = this.editArt.descript;
        this.newPrice = this.editArt.price;
        this.newOrder = this.editArt.order;
        this.editFileSelected = true;
      }
      catch (error) {
        console.log(error);
        this.editId = "";
        sweetAlert("Id Not Found", "",  "error");
      }
    },
    async updateArt() {
      console.log("in update");
      try {
        await axios.put('/api/artPieces', {
          id: this.editId,
          name: this.newName,
          date: this.newDate,
          descript: this.newDescript,
          price: this.newPrice,
          order: this.newOrder,
        });
        sweetAlert("Edits Successful!", "",  "success");
        this.newName = "";
        this.newDate = "";
        this.newDescript = "";
        this.newPrice = "";
        this.newOrder = 0;
        this.editId = "";
        this.editArt = null;
        this.editFileSelected = false;
        this.getArtPieces();
      }
      catch (error) {
        console.log(error);
        sweetAlert("Edits Failed", "",  "error");
      }
    },
    confirmDeleteArt() {
      if (confirm("Are you sure you want to delete this art piece?")) {
        this.deleteArt();
      }
    },
    async deleteArt() {
      console.log('in delete');
      try {
        let response = axios.delete("/api/artPieces/" + this.editId);
        this.getArtPieces();
        this.newName = "";
        this.newDate = "";
        this.newDescript = "";
        this.newPrice = "";
        this.newOrder = 0;
        this.editId = "";
        this.editArt = null;
        this.editFileSelected = false;
        sweetAlert("Delete Successful!", "",  "success");
      } catch (error) {
        console.log(error);
        sweetAlert("Delete Failed", "",  "error");
      }
    },
    
    
    ////////////////////////////////////////////////// EDIT COMMISSION
    async findCommissionId() {
      console.log("in findCommissionId");
      try {
        let response = await axios.get("/api/commission/" + this.editCommissionId);
        this.editCommission = response.data;
        if (!this.editCommission) {
          throw "Bad response";
        }
        console.log(this.editCommission);
        sweetAlert("Id Found!", "",  "success");
        this.curCommissionName = this.editCommission.name;
        this.curCommissionEmail = this.editCommission.email;
        this.curCommissionPriceRange = this.editCommission.priceRange;
        this.editCommissionSelected = true;
      }
      catch (error) {
        console.log(error);
        this.editCommissionId = "";
        this.editCommission = null;
        this.curCommissionName = "";
        this.curCommissionEmail = "";
        this.curCommissionPriceRange = "";
        sweetAlert("Id Not Found", "",  "error");
      }
    },
    async markCommissionStarted() {
      console.log("in markCommissionStarted()");
      try {
        await axios.put('/api/commission', {
          id: this.editCommissionId,
          started: true,
        });
        sweetAlert("Update Successful!", "",  "success");
        this.getCommissions();
        this.editCommissionId = "";
        this.curCommissionName = "";
        this.curCommissionEmail = "";
        this.curCommissionPriceRange = "";
        this.editCommission = null;
        this.editCommissionSelected = false;
      }
      catch (error) {
        console.log(error);
        sweetAlert("Update Failed", "",  "error");
      }
    },
    confirmDeleteCommission() {
      if (confirm("Are you sure you want to delete this commission?")) {
        this.deleteCommission();
      }
    },
    async deleteCommission() {
      console.log('in delete');
      try {
        let response = axios.delete("/api/commission/" + this.editCommissionId);
        this.getCommissions();
        this.editCommissionId = "";
        this.curCommissionName = "";
        this.curCommissionEmail = "";
        this.curCommissionPriceRange = "";
        this.editCommission = null;
        this.editCommissionSelected = false;
        sweetAlert("Delete Successful!", "",  "success");
      } catch (error) {
        console.log(error);
        sweetAlert("Delete Failed", "",  "error");
      }
    },
  }
});