package FoodApp.com.example.FoodAppdemo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CustomerOrderResponseDTO {
    private String id;
    private String trackingId;
    private String foodName;
    private String size;
    private int quantity;
    private double price;
    private String createdAt;
    private String status;
}

