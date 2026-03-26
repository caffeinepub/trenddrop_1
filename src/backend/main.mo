import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Option "mo:core/Option";
import Runtime "mo:core/Runtime";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Timer "mo:core/Timer";
import Time "mo:core/Time";
import Order "mo:core/Order";
import List "mo:core/List";
import Set "mo:core/Set";
import Principal "mo:core/Principal";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";

actor {
  // Authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Storage system
  include MixinStorage();

  // User Profile types and data
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Product types
  public type Product = {
    id : Text;
    name : Text;
    description : Text;
    price : Float;
    category : Text;
    imageUrl : Text;
    rating : Float;
    reviewCount : Nat;
    isTrending : Bool;
    isOnSale : Bool;
    salePrice : ?Float;
    badge : ?Text;
  };

  public type ProductInput = {
    name : Text;
    description : Text;
    price : Float;
    category : Text;
    imageUrl : Text;
    rating : Float;
    reviewCount : Nat;
    isTrending : Bool;
    isOnSale : Bool;
    salePrice : ?Float;
    badge : ?Text;
  };

  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Text.compare(p1.name, p2.name);
    };
  };

  let products = Map.empty<Text, Product>();
  var nextProductId = 10000;

  // Order types
  public type OrderItem = {
    productId : Text;
    productName : Text;
    quantity : Nat;
    unitPrice : Float;
  };

  public type ShippingAddress = {
    street : Text;
    city : Text;
    state : Text;
    zip : Text;
    country : Text;
  };

  public type Order = {
    orderId : Text;
    customerName : Text;
    customerEmail : Text;
    customerPhone : Text;
    shippingAddress : ShippingAddress;
    items : [OrderItem];
    subtotal : Float;
    shippingFee : Float;
    total : Float;
    status : Text;
    createdAt : Int;
    notes : ?Text;
  };

  public type OrderInput = {
    customerName : Text;
    customerEmail : Text;
    customerPhone : Text;
    shippingAddress : ShippingAddress;
    items : [OrderItem];
    subtotal : Float;
    shippingFee : Float;
    total : Float;
    notes : ?Text;
  };

  let orders = Map.empty<Text, Order>();
  var nextOrderId = 1000;

  // Newsletter email signups
  let newsletterEmails = Set.empty<Text>();

  // --- User Profile Management ---
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // --- Product Management ---
  public shared ({ caller }) func addProduct(productInput : ProductInput) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    let productId = nextProductId.toText();
    nextProductId += 1;
    let product : Product = {
      productInput with
      id = productId;
    };
    products.add(productId, product);
  };

  public shared ({ caller }) func updateProduct(productId : Text, productInput : ProductInput) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        let updatedProduct : Product = {
          productInput with
          id = productId;
        };
        products.add(productId, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func removeProduct(productId : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can remove products");
    };
    if (not products.containsKey(productId)) {
      Runtime.trap("Product does not exist and cannot be deleted.");
    };
    products.remove(productId);
  };

  // --- Product Queries ---
  public query ({ caller = _ }) func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query ({ caller = _ }) func getProductsByCategory(category : Text) : async [Product] {
    products.values().toArray().filter(
      func(product) { product.category == category }
    );
  };

  public query ({ caller = _ }) func getFeaturedProducts() : async [Product] {
    products.values().toArray().filter(
      func(product) { product.isTrending }
    );
  };

  public query ({ caller = _ }) func getProduct(productId : Text) : async Product {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  // --- Order Management ---
  public shared ({ caller = _ }) func placeOrder(orderInput : OrderInput) : async Text {
    let orderId = "ORD-" # nextOrderId.toText();
    nextOrderId += 1;
    let order : Order = {
      orderInput with
      orderId = orderId;
      status = "pending";
      createdAt = Time.now();
    };
    orders.add(orderId, order);
    orderId;
  };

  public query ({ caller = _ }) func getOrder(orderId : Text) : async Order {
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) { order };
    };
  };

  public query ({ caller = _ }) func getOrdersByEmail(email : Text) : async [Order] {
    orders.values().toArray().filter(
      func(order) { order.customerEmail == email }
    );
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Text, status : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updated : Order = { order with status = status };
        orders.add(orderId, updated);
      };
    };
  };

  // --- Newsletter Signup ---
  public shared ({ caller = _ }) func addNewsletterEmail(email : Text) : async () {
    if (newsletterEmails.contains(email)) {
      Runtime.trap("Email already in newsletter list");
    };
    newsletterEmails.add(email);
  };

  public query ({ caller }) func getNewsletterEmails() : async [Text] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view newsletter emails");
    };
    newsletterEmails.toArray();
  };

  // --- Seed Data ---
  public shared ({ caller = _ }) func addSampleProducts() : async () {
    let sampleProducts : [Product] = [
      {
        id = "1"; name = "Smartphone Gimbal"; description = "Stabilize your phone videos like a pro. 3-axis stabilization."; price = 79.99; category = "Tech"; imageUrl = "https://picsum.photos/seed/gimbal/400/400"; rating = 4.7; reviewCount = 156; isTrending = true; isOnSale = true; salePrice = ?49.99; badge = ?"TRENDING";
      },
      {
        id = "2"; name = "Robot Vacuum"; description = "Automatic smart floor cleaning with app control."; price = 229.0; category = "Home"; imageUrl = "https://picsum.photos/seed/vacuum/400/400"; rating = 4.8; reviewCount = 305; isTrending = true; isOnSale = true; salePrice = ?179.0; badge = ?"HOT";
      },
      {
        id = "3"; name = "LED Vanity Mirror"; description = "10x magnification lighted makeup mirror."; price = 39.95; category = "Beauty"; imageUrl = "https://picsum.photos/seed/mirror/400/400"; rating = 4.6; reviewCount = 87; isTrending = true; isOnSale = false; salePrice = null; badge = ?"TRENDING";
      },
      {
        id = "4"; name = "Wireless Charging Pad"; description = "15W fast wireless charging for all devices."; price = 17.95; category = "Tech"; imageUrl = "https://picsum.photos/seed/charger/400/400"; rating = 4.5; reviewCount = 124; isTrending = false; isOnSale = true; salePrice = ?12.99; badge = ?"SALE";
      },
      {
        id = "5"; name = "LED Light Strip"; description = "Smart RGB ambient lights, voice & app controlled."; price = 25.99; category = "Home"; imageUrl = "https://picsum.photos/seed/ledstrip/400/400"; rating = 4.6; reviewCount = 156; isTrending = true; isOnSale = false; salePrice = null; badge = ?"TRENDING";
      },
      {
        id = "6"; name = "Portable Blender"; description = "USB rechargeable personal blender for smoothies on the go."; price = 24.95; category = "Lifestyle"; imageUrl = "https://picsum.photos/seed/blender/400/400"; rating = 4.9; reviewCount = 382; isTrending = true; isOnSale = false; salePrice = null; badge = ?"HOT";
      },
      {
        id = "7"; name = "VR Headset"; description = "Immersive standalone VR gaming and video."; price = 189.0; category = "Tech"; imageUrl = "https://picsum.photos/seed/vrheadset/400/400"; rating = 5.0; reviewCount = 112; isTrending = true; isOnSale = false; salePrice = null; badge = ?"TRENDING";
      },
      {
        id = "8"; name = "Thermal Coffee Mug"; description = "Self-heating mug keeps coffee at your perfect temp."; price = 34.99; category = "Lifestyle"; imageUrl = "https://picsum.photos/seed/mug/400/400"; rating = 4.4; reviewCount = 67; isTrending = false; isOnSale = true; salePrice = ?24.99; badge = ?"SALE";
      },
      {
        id = "9"; name = "Gua Sha Stone Set"; description = "Facial massage tools for glowing skin."; price = 19.99; category = "Beauty"; imageUrl = "https://picsum.photos/seed/guasha/400/400"; rating = 4.7; reviewCount = 203; isTrending = true; isOnSale = false; salePrice = null; badge = ?"TRENDING";
      },
      {
        id = "10"; name = "Fidget Ring Pack"; description = "Spinning anxiety rings - viral TikTok item."; price = 12.99; category = "Novelty"; imageUrl = "https://picsum.photos/seed/fidget/400/400"; rating = 4.3; reviewCount = 541; isTrending = true; isOnSale = false; salePrice = null; badge = ?"VIRAL";
      },
    ];
    sampleProducts.forEach(
      func(product) {
        products.add(product.id, product);
      }
    );
  };
};
