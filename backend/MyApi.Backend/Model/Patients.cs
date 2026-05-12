using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MyApi.Backend.Models;
using MyApi.Backend.Enum;

namespace MyApi.Backend.Models{
    [Table("PATIENTS")]
    public class Patient{

        [Key]
        [Column("PATIENT_ID")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int patientId {get; set;}

        [Column("PATIENT_NAME")]
        public required string name {get; set;}

        [Column("CASE")]
        public required Case patientCase {get; set;}

        [Column("HEALTHSTATUS")]
        public required HealthStatus status { get; set;}

        [Column("ARRIVAL_DATE")]
        public required DateTime arrival_date { get; set;}
    } 
}