package FoodApp.com.example.FoodAppdemo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SellerOrderResponseDTO {
    private String id;
    private String trackingId;
    private String foodName;
    private String buyerName;
    private String size;
    private int quantity;
    private double price;
    private String status;      // ⭐ NEW FIELD
    private String createdAt;
}

