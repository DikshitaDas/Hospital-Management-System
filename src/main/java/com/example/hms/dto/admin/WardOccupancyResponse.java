package com.example.hms.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor

public class WardOccupancyResponse {

    private String wardName;

    private String wardType;

    /** Planned capacity configured on the ward (totalBeds field). */
    private Long plannedCapacity;

    /** Physical bed records created in the beds table. */
    private Long bedsRegistered;

    /** Beds with status OCCUPIED (patient admitted). */
    private Long occupiedBeds;

    /** Beds with status AVAILABLE (ready for new admission). */
    private Long availableBeds;
}
