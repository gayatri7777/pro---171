AFRAME.registerComponent("createmarkers", {
    init: async function (){
        var mainScene = document.querySelector("#main-scene");
        var toys = await this.getAllToys();
        toys.map(toy => {
            var marker = document.createElement("a-marker");
            marker.setAttribute("id", toy.id);
            marker.setAttribute("type", "pattern");
            marker.setAttribute("url", toy.marker_pattern_url);
            marker.setAttribute("cursor", {
                rayOrigin: "mouse"
            });
            marker.setAttribute("markerhandler",{});
            mainScene.appendChild(marker);

            //Getting today's day
            var todaysDate = new Date();
            var todaysDay =todaysDate.getDay();
            // Sunday - Saturday : 0-6
            var days = [
                "sunday",
                "monday",
                "tuesday",
                "wednesday",
                "friday",
                "saturday",
            ];
            if (!toy.unavailable_days.includes(days[todaysDate])){

                 // Adding 3D model to scene 
            var model = document.createElement("a-entity");
            model.setAttribute('id', `model-${toy.id}`);
            model.setAttribute("position", toy.model_geometry.position);
            model.setAttribute("rotation", toy.model_geometry.rotation);
            model.setAttribute("scale", toy.model_geometry.scale);
            model.setAttribute("gltf-model",`url(${toy.model_url})`);
            model.setAttribute("animation-mixer",{});
            model.setAttribute("gesture-handler",{});
            marker.appendChild(model);

            // Price of the toys
            var price = document.createElement("a-entity");
            price.setAttribute("id", `price-${toy.id}`);
            price.setAttribute("position",{x:0.03, y:0.05, z: 0.1});
            price.setAttribute("rotation", {x: 0, y:0, z:0});
            price.setAttribute("text",{
                font: "mozillavr",
                color: "white",
                width: 3,
                align: "center",
                value: `Only\n $${toy.price}`
            });

            pricePlane.appendChild(price);
            marker.appendChild(pricePlane);
             } 
         });
    },
    getAllToys: async function(){
        return await firebase
        .firestore()
        .collection("toys")
        .get()
        .then(snap => {
            return snap.docs.map( doc => doc.data());
        });
    }

});