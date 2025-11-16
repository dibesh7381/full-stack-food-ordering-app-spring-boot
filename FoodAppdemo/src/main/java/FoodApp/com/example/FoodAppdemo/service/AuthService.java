package FoodApp.com.example.FoodAppdemo.service;

import FoodApp.com.example.FoodAppdemo.dto.*;
import FoodApp.com.example.FoodAppdemo.exception.CustomException;
import FoodApp.com.example.FoodAppdemo.model.*;
import FoodApp.com.example.FoodAppdemo.repository.*;

import FoodApp.com.example.FoodAppdemo.security.JwtUtil;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private FoodRepository foodRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private Cloudinary cloudinary;

    // ⭐ SIGNUP
    public SignupResponseDTO signup(SignupRequestDTO request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomException("Email already registered!", 400);
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("CUSTOMER");

        User saved = userRepository.save(user);

        return new SignupResponseDTO(
                saved.getId(),
                saved.getUsername(),
                saved.getEmail(),
                saved.getRole()
        );
    }

    // ⭐ LOGIN
    public LoginResponseDTO login(LoginRequestDTO request) {

        User user = userRepository.findByEmail(request.getEmail());
        if (user == null) throw new CustomException("User not found!", 404);

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new CustomException("Invalid credentials!", 401);
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        return new LoginResponseDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                token
        );
    }

    // ⭐ GET PROFILE
    public ProfileResponseDTO getProfile(String email) {

        User user = userRepository.findByEmail(email);
        if (user == null) throw new CustomException("User not found!", 404);

        return new ProfileResponseDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole()
        );
    }

    // ⭐ UPDATE PROFILE
    public ProfileResponseDTO updateProfile(String email, UpdateProfileRequestDTO dto) {

        User user = userRepository.findByEmail(email);
        if (user == null) throw new CustomException("User not found!", 404);

        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());

        User updated = userRepository.save(user);

        return new ProfileResponseDTO(
                updated.getId(),
                updated.getUsername(),
                updated.getEmail(),
                updated.getRole()
        );
    }

    // ⭐ HOME PAGE
    public HomePageDTO homePage() {
        return new HomePageDTO(
                "This is for Home Page",
                "Visible for all users"
        );
    }

    // ⭐ BECOME SELLER (photo + role upgrade)
    public SellerResponseDTO becomeSeller(String email, SellerRequestDTO dto, org.springframework.web.multipart.MultipartFile image) {

        User user = userRepository.findByEmail(email);
        if (user == null) throw new CustomException("User not found!", 404);

        if (sellerRepository.existsByUserId(user.getId())) {
            throw new CustomException("You are already a seller!", 400);
        }

        // ⭐ Cloudinary Upload
        String imageUrl;
        try {
            var upload = cloudinary.uploader().upload(
                    image.getBytes(),
                    ObjectUtils.asMap("folder", "foodapp/sellers")
            );
            imageUrl = upload.get("secure_url").toString();
        } catch (Exception e) {
            throw new CustomException("Image upload failed!", 500);
        }

        // ⭐ Save Seller
        Seller seller = new Seller(
                null,
                user.getId(),
                dto.getShopName(),
                dto.getLocation(),
                dto.getEstablishedYear(),
                dto.getBusinessType(),
                imageUrl,
                dto.getOwnerName()
        );

        Seller saved = sellerRepository.save(seller);

        // Upgrade role
        user.setRole("SELLER");
        userRepository.save(user);

        // Generate new JWT
        String newToken = jwtUtil.generateToken(user.getEmail(), user.getRole());

        return new SellerResponseDTO(
                saved.getId(),
                saved.getUserId(),
                saved.getShopName(),
                saved.getLocation(),
                saved.getEstablishedYear(),
                saved.getBusinessType(),
                saved.getImageUrl(),
                saved.getOwnerName(),
                user.getRole(),
                newToken
        );
    }

    // ⭐ GET SELLER DETAILS
    public SellerResponseDTO getSeller(String email) {

        User user = userRepository.findByEmail(email);
        if (user == null) throw new CustomException("User not found!", 404);

        Seller seller = sellerRepository.findByUserId(user.getId());
        if (seller == null) throw new CustomException("Seller profile not found!", 404);

        return new SellerResponseDTO(
                seller.getId(),
                seller.getUserId(),
                seller.getShopName(),
                seller.getLocation(),
                seller.getEstablishedYear(),
                seller.getBusinessType(),
                seller.getImageUrl(),
                seller.getOwnerName(),
                user.getRole(),
                null
        );
    }

    // ⭐ ⭐ ⭐  ADD FOOD — BASE64 VERSION
    public FoodResponseDTO addFood(String email, AddFoodRequest dto) throws Exception {

        User user = userRepository.findByEmail(email);
        if (user == null) throw new CustomException("User not found!", 404);

        Seller seller = sellerRepository.findByUserId(user.getId());
        if (seller == null) throw new CustomException("You are not a seller!", 403);

        // ⭐ Upload base64 → Cloudinary
        String imageUrl;
        try {
            Map upload = cloudinary.uploader().upload(
                    dto.getImageBase64(),
                    ObjectUtils.asMap("folder", "foodapp/foods")
            );
            imageUrl = upload.get("secure_url").toString();
        } catch (Exception e) {
            throw new CustomException("Image upload failed!", 500);
        }

        // ⭐ Create Food object
        Food food = new Food();
        food.setName(dto.getName());
        food.setType(dto.getType());
        food.setCategory(dto.getCategory());
        food.setDescription(dto.getDescription());
        food.setImageUrl(imageUrl);
        food.setSellerId(user.getId());

        List<FoodSize> sizeList = dto.getSizes().stream()
                .map(s -> new FoodSize(s.getSize(), s.getPrice()))
                .toList();

        food.setSizes(sizeList);

        Food saved = foodRepository.save(food);

        List<FoodSizeDTO> sizeDTOs = sizeList.stream()
                .map(s -> new FoodSizeDTO(s.getSize(), s.getPrice()))
                .toList();

        return new FoodResponseDTO(
                saved.getId(),
                saved.getName(),
                saved.getType(),
                saved.getCategory(),
                saved.getDescription(),
                saved.getImageUrl(),
                sizeDTOs,
                seller.getShopName()
        );
    }

    // ⭐ GET SELLER’S FOODS
    public List<FoodResponseDTO> getMyFoods(String email) {

        User user = userRepository.findByEmail(email);
        if (user == null) throw new CustomException("User not found!", 404);

        Seller seller = sellerRepository.findByUserId(user.getId());
        if (seller == null) throw new CustomException("You are not a seller!", 403);

        List<Food> foods = foodRepository.findBySellerId(user.getId());

        return foods.stream().map(food ->
                new FoodResponseDTO(
                        food.getId(),
                        food.getName(),
                        food.getType(),
                        food.getCategory(),
                        food.getDescription(),
                        food.getImageUrl(),
                        food.getSizes().stream()
                                .map(s -> new FoodSizeDTO(s.getSize(), s.getPrice()))
                                .toList(),
                        seller.getShopName()
                )
        ).toList();
    }

    // ⭐ UPDATE FOOD
    public FoodResponseDTO updateFood(String email, String id, UpdateFoodRequest dto) throws Exception {

        User user = userRepository.findByEmail(email);
        if (user == null) throw new CustomException("User not found!", 404);

        Seller seller = sellerRepository.findByUserId(user.getId());
        if (seller == null) throw new CustomException("Not a seller!", 403);

        Food food = foodRepository.findById(id)
                .orElseThrow(() -> new CustomException("Food not found!", 404));

        // UPDATE FIELDS
        food.setName(dto.getName());
        food.setType(dto.getType());
        food.setCategory(dto.getCategory());
        food.setDescription(dto.getDescription());

        // ⭐ If image changed → upload new base64
        if (dto.getImageBase64() != null && dto.getImageBase64().startsWith("data")) {
            Map upload = cloudinary.uploader().upload(
                    dto.getImageBase64(),
                    ObjectUtils.asMap("folder", "foodapp/foods")
            );
            food.setImageUrl(upload.get("secure_url").toString());
        }

        // sizes update
        food.setSizes(
                dto.getSizes().stream()
                        .map(s -> new FoodSize(s.getSize(), s.getPrice()))
                        .toList()
        );

        Food saved = foodRepository.save(food);

        List<FoodSizeDTO> sizeList = saved.getSizes().stream()
                .map(s -> new FoodSizeDTO(s.getSize(), s.getPrice()))
                .toList();

        return new FoodResponseDTO(
                saved.getId(),
                saved.getName(),
                saved.getType(),
                saved.getCategory(),
                saved.getDescription(),
                saved.getImageUrl(),
                sizeList,
                seller.getShopName()
        );
    }

    // ⭐ DELETE FOOD
    public void deleteFood(String email, String id) {

        User user = userRepository.findByEmail(email);
        if (user == null) throw new CustomException("User not found!", 404);

        Food food = foodRepository.findById(id)
                .orElseThrow(() -> new CustomException("Food not found!", 404));

        foodRepository.delete(food);
    }

    // ⭐ GET ALL FOODS (PUBLIC)
    public List<FoodResponseDTO> getAllFoods() {

        List<Food> foods = foodRepository.findAll();

        return foods.stream().map(food -> {

            Seller seller = sellerRepository.findByUserId(food.getSellerId());

            return new FoodResponseDTO(
                    food.getId(),
                    food.getName(),
                    food.getType(),
                    food.getCategory(),
                    food.getDescription(),
                    food.getImageUrl(),
                    food.getSizes().stream()
                            .map(s -> new FoodSizeDTO(s.getSize(), s.getPrice()))
                            .toList(),
                    seller != null ? seller.getShopName() : "Unknown"
            );

        }).toList();
    }
}





