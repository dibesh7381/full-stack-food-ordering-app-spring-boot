package FoodApp.com.example.FoodAppdemo.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "orders")
public class Order {

    @Id
    private String id;

    private String buyerId;
    private String foodId;
    private String foodName;
    private String size;
    private int quantity;
    private double price;
    private String sellerId;

    private LocalDateTime createdAt = LocalDateTime.now();
}

