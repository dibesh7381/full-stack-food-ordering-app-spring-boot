package FoodApp.com.example.FoodAppdemo.controller;

import FoodApp.com.example.FoodAppdemo.dto.*;
import FoodApp.com.example.FoodAppdemo.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/auth/api")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    @Autowired
    private AuthService authService;


    // ⭐ SIGNUP
    @PostMapping("/signup")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponseDTO<SignupResponseDTO>> signup(@RequestBody SignupRequestDTO request) {
        SignupResponseDTO response = authService.signup(request);
        return ResponseEntity.ok(new ApiResponseDTO<>(true, "Signup successful", response));
    }



    // ⭐ LOGIN
    @PostMapping("/login")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponseDTO<LoginResponseDTO>> login(@RequestBody LoginRequestDTO request) {

        LoginResponseDTO loginRes = authService.login(request);

        ResponseCookie tokenCookie = ResponseCookie.from("token", loginRes.getToken())
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(7 * 24 * 60 * 60)
                .build();

        loginRes.setToken(null);

        return ResponseEntity.ok()
                .header("Set-Cookie", tokenCookie.toString())
                .body(new ApiResponseDTO<>(true, "Login successful", loginRes));
    }



    // ⭐ LOGOUT
    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponseDTO<String>> logout() {

        ResponseCookie clearCookie = ResponseCookie.from("token", "")
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header("Set-Cookie", clearCookie.toString())
                .body(new ApiResponseDTO<>(true, "Logged out successfully", null));
    }



    // ⭐ PROFILE
    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponseDTO<ProfileResponseDTO>> profile() {

        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ProfileResponseDTO profile = authService.getProfile(email);

        return ResponseEntity.ok(new ApiResponseDTO<>(true, "Profile fetched successfully", profile));
    }



    // ⭐ UPDATE PROFILE
    @PutMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponseDTO<ProfileResponseDTO>> updateProfile(
            @RequestBody UpdateProfileRequestDTO dto
    ) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ProfileResponseDTO updated = authService.updateProfile(email, dto);

        return ResponseEntity.ok(new ApiResponseDTO<>(true, "Profile updated successfully", updated));
    }



    // ⭐ HOME PAGE
    @GetMapping("/homepage")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponseDTO<?>> getHomePage() {
        HomePageDTO dto = authService.homePage();
        return ResponseEntity.ok(new ApiResponseDTO<>(true, "HomePage fetched successfully", dto));
    }



    // ⭐ BECOME SELLER
    @PostMapping("/become-seller")
    @PreAuthorize("hasAuthority('CUSTOMER')")
    public ResponseEntity<ApiResponseDTO<SellerResponseDTO>> becomeSeller(
            @RequestPart("data") SellerRequestDTO dto,
            @RequestPart("image") MultipartFile image
    ) {

        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        SellerResponseDTO response = authService.becomeSeller(email, dto, image);

        String newToken = response.getToken();
        ResponseCookie tokenCookie = ResponseCookie.from("token", newToken)
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(7 * 24 * 60 * 60)
                .build();

        response.setToken(null);

        return ResponseEntity.ok()
                .header("Set-Cookie", tokenCookie.toString())
                .body(new ApiResponseDTO<>(true, "Seller created successfully", response));
    }



    // ⭐ GET SELLER DETAILS
    @GetMapping("/seller")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<ApiResponseDTO<SellerResponseDTO>> getSellerData() {

        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        SellerResponseDTO seller = authService.getSeller(email);

        return ResponseEntity.ok(
                new ApiResponseDTO<>(true, "Seller details fetched successfully", seller)
        );
    }



    // ⭐ ADD FOOD
    @PostMapping("/add-food")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<ApiResponseDTO<FoodResponseDTO>> addFood(
            @RequestBody AddFoodRequest dto
    ) throws Exception {

        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        FoodResponseDTO savedFood = authService.addFood(email, dto);

        return ResponseEntity.ok(
                new ApiResponseDTO<>(true, "Food added successfully", savedFood)
        );
    }



    // ⭐ GET MY FOODS
    @GetMapping("/my-foods")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<ApiResponseDTO<List<FoodResponseDTO>>> getMyFoods() {

        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<FoodResponseDTO> foods = authService.getMyFoods(email);

        return ResponseEntity.ok(new ApiResponseDTO<>(true, "Seller foods fetched", foods));
    }



    // ⭐ UPDATE FOOD
    @PutMapping("/update-food/{id}")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<ApiResponseDTO<FoodResponseDTO>> updateFood(
            @PathVariable String id,
            @RequestBody UpdateFoodRequest dto
    ) throws Exception {

        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        FoodResponseDTO updated = authService.updateFood(email, id, dto);

        return ResponseEntity.ok(new ApiResponseDTO<>(true, "Food updated successfully", updated));
    }



    // ⭐ DELETE FOOD
    @DeleteMapping("/delete-food/{id}")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<ApiResponseDTO<String>> deleteFood(@PathVariable String id) {

        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        authService.deleteFood(email, id);

        return ResponseEntity.ok(new ApiResponseDTO<>(true, "Food deleted successfully", null));
    }



    // ⭐ GET ALL FOODS (Authenticated)
    @GetMapping("/all-foods")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponseDTO<List<FoodResponseDTO>>> getAllFoods() {

        List<FoodResponseDTO> foods = authService.getAllFoods();

        return ResponseEntity.ok(
                new ApiResponseDTO<>(true, "All foods fetched successfully", foods)
        );
    }

    // ⭐⭐⭐ ADD TO CART — NEW API
    @PostMapping("/add-to-cart")
    @PreAuthorize("hasAuthority('CUSTOMER')")
    public ResponseEntity<ApiResponseDTO<CartItemResponseDTO>> addToCart(
            @RequestBody AddToCartRequestDTO req
    ) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        CartItemResponseDTO response = authService.addToCart(email, req);

        return ResponseEntity.ok(
                new ApiResponseDTO<>(true, "Item added to cart", response)
        );
    }
    // ⭐⭐⭐ GET ALL CART ITEMS
    @GetMapping("/my-cart")
    @PreAuthorize("hasAuthority('CUSTOMER')")
    public ResponseEntity<ApiResponseDTO<List<CartItemResponseDTO>>> getMyCart() {

        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        List<CartItemResponseDTO> items = authService.getMyCart(email);

        return ResponseEntity.ok(
                new ApiResponseDTO<>(true, "Cart items fetched successfully", items)
        );
    }

    // ⭐⭐⭐ INCREASE QUANTITY
    @PutMapping("/cart/increase/{cartId}")
    @PreAuthorize("hasAuthority('CUSTOMER')")
    public ResponseEntity<ApiResponseDTO<CartItemResponseDTO>> increaseQty(
            @PathVariable String cartId
    ) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        CartItemResponseDTO updated = authService.increaseQty(email, cartId);

        return ResponseEntity.ok(
                new ApiResponseDTO<>(true, "Quantity increased", updated)
        );
    }

    // ⭐⭐⭐ DECREASE QUANTITY
    @PutMapping("/cart/decrease/{cartId}")
    @PreAuthorize("hasAuthority('CUSTOMER')")
    public ResponseEntity<ApiResponseDTO<CartItemResponseDTO>> decreaseQty(
            @PathVariable String cartId
    ) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        CartItemResponseDTO updated = authService.decreaseQty(email, cartId);

        return ResponseEntity.ok(
                new ApiResponseDTO<>(true, "Quantity decreased", updated)
        );
    }

    // ⭐⭐⭐ DELETE CART ITEM
    @DeleteMapping("/cart/delete/{cartId}")
    @PreAuthorize("hasAuthority('CUSTOMER')")
    public ResponseEntity<ApiResponseDTO<String>> deleteCartItem(
            @PathVariable String cartId
    ) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        authService.deleteCartItem(email, cartId);

        return ResponseEntity.ok(
                new ApiResponseDTO<>(true, "Item removed from cart", null)
        );
    }

}




