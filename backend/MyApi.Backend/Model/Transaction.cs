using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MyApi.Backend.Models;
namespace MyApi.Backend.Models
{
    [Table("TRANSACTIONS")]
    public class Transaction
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("TRANSACTION_ID")]
        public int TransactionId { get; set; }

        [Column("TOTAL_COST")]
        public decimal TotalCost { get; set; }

        // Oracle bool conversion needed
        [Column("ISPAID")]
        public int isPaid { get; set; }

        [Column("CREATED_AT")]
        public DateTime CreatedAt { get; set; }

        [ForeignKey("MEDICINE_ID")]
        public Medicine medicine {get;set;}

        [ForeignKey("PATIENT_ROOM_ID")]
        public PatientRoom patient_room {get;set;}

        [Column("Quantity")]
        public required int quantity {get;set;}
    }
}