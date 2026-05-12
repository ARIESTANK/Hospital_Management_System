using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MyApi.Backend.Enum;

namespace MyApi.Backend.Models{

    [Table("MEDICINES")]
    public class Medicine{
        
        [Key]
        [Column("MEDICINE_ID")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int medicineId {get;set;}

        [Column("MEDICINE_CODE")]
        public string medicineCode {get;set;}

        [Column("MEDICINE_NAME")]
        public required string medicineName {get;set;}

        [Column("STOCK")]
        public required int stock { get; set; }

        [Column("PRICE")]
        public required decimal price { get; set;}

    }

}