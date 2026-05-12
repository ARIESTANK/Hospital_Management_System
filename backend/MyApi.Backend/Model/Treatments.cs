using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

using MyApi.Backend.Models;

namespace MyApi.Backend.Models{
    [Table("TREATMENTS")]
    public class Treatment{

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("TREATMENT_ID")]
        public int treatmentId { get; set;}

        [ForeignKey("PATIENT_ROOM_ID")]
        public required PatientRoom patient_room {get;set;}

        [Column("TYPE")]
        public required string type{get;set;}

        [Column("TOTAL_COST")]
        public required decimal totalCost { get; set;}

        [Column("CREATED_AT")]
        public required DateTime createdAt {get;set;}

        [Column("ISPAID")]
        public  required int isPaid {get;set;}

    }
}