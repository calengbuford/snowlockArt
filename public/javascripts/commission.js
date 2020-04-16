var app = new Vue({
  el: '#art-commission',
  data: {
    name: "",
    email: "",
    priceRange: "",
    descript: "",
  },
  computed: {
    disableRequest: function() {
      if (this.name === "" || this.email === "" || this.priceRange === "" || this.descript === "") {
        return true;
      }
      return false;
    },
  },
  methods: {
    async requestCommission() {
      console.log("in requestCommission()");
      try {
        let r2 = await axios.post('/api/commission', {
          name: this.name,
          email: this.email,
          priceRange: this.priceRange,
          descript: this.descript,
        });
        sweetAlert("Commission successfully sent! Calen will reach out to you soon.", "",  "success");
        this.name = "";
        this.email = "";
        this.priceRange = "";
        this.descript = "";
      }
      catch (error) {
        console.log(error);
        sweetAlert("Commission failed to send", "",  "error");
      }
    },
    
    
    // async requestCommission() {
    //   console.log("in requestCommission()");
      
    //   // Format email body
    //   let emailBody = "Name: " + this.name + ",\nEmail: " + this.email +
    //               ",\nPrice range: " + this.priceRange + ",\nDescription: " + this.descript + "\n";
    //   console.log(emailBody);
      
    // //   Email.send({
    // //   	Host: "smtp.gmail.com",
    // //   	Username : "4silverhonor@gmail.com",
    // //   	Password : "wander4444",
    // //   	To : '4silverhonor@gmail.com',
    // //   	From : "4silverhonor@gmail.com",
    // //   	Subject : "New art commission",
    // //   	Body : emailBody,
    // // 	}).then(
    // // 		message => sweetAlert("Email sent successfully", "",  "success")
    // // 	);
    
    
    //   // try {
    //   // 	await Email.send({
    //   //   	Host: "smtp.gmail.com",
    //   //   	Username : "4silverhonor@gmail.com",
    //   //   	Password : "",
    //   //   	To : '4silverhonor@gmail.com',
    //   //   	From : "4silverhonor@gmail.com",
    //   //   	Subject : "New art commission",
    //   //   	Body : emailBody,
    //   // 	});
    //   // 	sweetAlert("Email sent successfully", "",  "success");
    //   // } catch (error) {
    //   //   console.log(error);
    //   // 	sweetAlert("Email failed to send", "",  "error");
    //   // }
    // },
  }
});