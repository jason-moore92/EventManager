# Tm sahaya service

# start date: 2021-12-22

Admin proj using express js.

## Technical points

1. Roles (present situation: one or more different routes for same feature based on role.) 
   1. admin:  
   2. storerep: (admin of the store.)
      1. business-sales-admin: 
      2. business-sales-representatives:
   3. customersupport-admin: ()
   4. customersupport-user: ()
   5. user (can be removed w.r.t same route in `flutter-backend-services`)
2. Roles (in Future)
   1. Two layers
      1. roles list
      2. if a user related to trademantri or non-trademantri
   2. Need to write a matrix role/vs
   3. Root stores vs child stores (Names specified in env file are Root/admin stores and rest all child stores) (Already written the middleware store_id_check for the operations.)
   
   #######


## Unit Tests

1. For sts file use `npm run utest -- -g "STS"`