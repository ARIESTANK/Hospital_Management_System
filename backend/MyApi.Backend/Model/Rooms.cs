using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MyApi.Backend.Enum;

namespace MyApi.Backend.Models
{
    [Table("ROOMS")] // Maps to your Oracle table name
    public class Room
    {
        [Key]
        [Column("ROOM_ID")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int RoomId { get; set; }

        [Required]
        [StringLength(10)]
        [Column("ROOM_NUMBER")]
        public required string RoomNumber { get; set; } // e.g., "A-101"

        [Required]
        [Column("ROOM_TYPE")]
        public required string RoomType { get; set; } // ICU, General, Private, Ward

        [Required]
        [Column("STATUS")]
        public Status Status { get; set; } // Available, Occupied, Under Maintenance

        [Column("DAILY_RATE")]
        public decimal DailyRate { get; set; }



    }
}