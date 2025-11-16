package FoodApp.com.example.FoodAppdemo.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "sellers")
public class Seller {

    @Id
    private String id;

    private String userId;

    private String shopName;
    private String location;
    private int establishedYear;

    private String businessType;
    private String imageUrl;

    private String ownerName;
}
