package FoodApp.com.example.FoodAppdemo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SellerRequestDTO {

    private String shopName;
    private String location;
    private int establishedYear;

    private String businessType;
    private String ownerName;
}

