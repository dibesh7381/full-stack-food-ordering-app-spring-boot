package FoodApp.com.example.FoodAppdemo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FoodResponseDTO {

    private String id;
    private String name;
    private String type;
    private String category;
    private String description;
    private String imageUrl;

    private List<FoodSizeDTO> sizes;  // ⭐ size list first (React expects this order)

    private String sellerName;        // ⭐ seller / kitchen / hotel name
}


