AFRAME.registerComponent("markerhandler", {
  init: async function() {
    this.el.addEventListener("markerFound", () => {
      console.log("marker is found");
      this.handleMarkerFound();
    });

    this.el.addEventListener("markerLost", () => {
      console.log("marker is lost");
      this.handleMarkerLost();
    });
  },
  handleMarkerFound: function(toys, markerId) {

    // Getting today's day
    var todaysDate = new Date();
    var todaysDay = todaysDate.getDay();

    // sunday-saturday : 0-6
    var days = [
      "sunday",
      "monday",
      "tuesday",
      "thursday",
      "friday",
      "saturday"
      
    ];

    // Get the dish based on ID
    var toy = toys.filter(toy => toy.id === markerId)[0];

    // Check if the dish is available  today
    if (toy.unavailable_days.includes(days[todaysDate])){
      swal ({
        icon: "warning",
        title: toy.toy_name.toUpperCase(),
        text: "This toy is not available today!!!",
        timer: 2500,
        buttons: false
      });
    }else {
      //Changing Model scale to initial scale 
      var model = document.querySelector(`#model-${dish.id}`);
      model.setAttribute("position",toy.model_geometry.position);
      model.setAttribute("rotation",toy.model_geometry.rotation);
      model.setAttribute("scale", toy.model_geometry.scale);

      //Update UI conent VISIBILITY of AR scene(MODEL)

      model.setAttribute("visible", true);

      var pricePlane = document.querySelector(`#main-plane-${toy.id}`);
      pricePlane.setAttribute("visible", true)

    
    // Changing button div visibility
    var buttonDiv = document.getElementById("button-div");
    buttonDiv.style.display = "flex";

    var orderButtton = document.getElementById("order-button");
    var orderSummaryButtton = document.getElementById("order-summary-button");

    // Handling Click Events
    orderButtton.addEventListener("click", () => {
      swal({
        icon: "https://i.imgur.com/4NZ6uLY.jpg",
        title: "Thanks For Order !",
        text: "  ",
        timer: 2000,
        buttons: false
      });
    });


    orderSummaryButtton.addEventListener("click", () => {
      swal({
        icon: "warning",
        title: "Order Summary",
        text: "Work In Progress"
      });
    });
    }
  },

  handleOrder: function (uid, toy){
      // Reading current UID order details
      firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .get()
        .then(doc => {
          var details = doc.data();

          if (details["current_orders"][toy.id]) {
            // Increasing Current Quantity
            details["current_orders"][toy.id]["quantity"]+=1;

            //calculating subtotal of item
            var currentQuantity = details["current_orders"][toy.id]["quantity"];

            details["current_orders"][toy.id]["subtotal"] 
            currentQuantity * toy.price;
          } else {
            details["current_orders"][toy.id] = {
              item: toy.toy_name,
              price: toy.price,
              quantity: 1,
              subtotal: toy.price * 1
            };
          }

          details.total_bill += toy.price;

          // Updating Db
          firebase  
            .firestore()
            .collection("users")
            .doc(doc.id)
            .update(details);
        });
    },

  handleMarkerLost: function() {
    // Changing button div visibility
    var buttonDiv = document.getElementById("button-div");
    buttonDiv.style.display = "none";
  }
});
