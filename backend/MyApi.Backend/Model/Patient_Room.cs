using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using MyApi.Backend.Models;
using MyApi.Backend.Enum;

namespace MyApi.Backend.Models{
    [Table("PATIENT_ROOM")]
    public class PatientRoom{

        [Key]
        [Column("PATIENT_ROOM_ID")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int patient_room_id {get; set;}

        [ForeignKey("PATIENT_ID")]
        public Patient patient {get; set;}

        [ForeignKey("ROOM_ID")]
        public Room room {get;set;}

        [ForeignKey("USER_ID")]
        public User user{get;set;}

        [Column("CREATED_AT")]
        public required DateTime createdAt {get;set;}
    }

}