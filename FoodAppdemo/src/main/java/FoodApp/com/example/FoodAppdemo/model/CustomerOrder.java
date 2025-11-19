package FoodApp.com.example.FoodAppdemo.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "customer_orders")
public class CustomerOrder {

    @Id
    private String id;

    private String trackingId; // SAME in both tables

    private String buyerId;
    private String foodId;
    private String foodName;

    private String size;
    private int quantity;
    private double price;

    private String sellerId; // seller userId

    private String status = "PLACED";  // ⭐ NEW FIELD

    private LocalDateTime createdAt = LocalDateTime.now();
}

