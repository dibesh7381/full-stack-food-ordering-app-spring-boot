package FoodApp.com.example.FoodAppdemo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SellerResponseDTO {

    private String id;
    private String userId;

    private String shopName;
    private String location;
    private int establishedYear;

    private String businessType;
    private String imageUrl;

    private String ownerName;

    private String role; // CUSTOMER → SELLER updated message
    private String token;

}

