using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MyApi.Backend.Enum;

namespace MyApi.Backend.Models{
    [Table("USERS")]
    public class User{

        [Key]
        [Column("USER_ID")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int userId { get; set; }

        [Column("USER_NAME")]
        public required string userName {get;set;}

        [Column("USER_EMAIL")]
        public required string userEmail{get;set;}

        [Column("USER_PASSWORD")]
        public required string userPassword{get;set;}

        [Column("USER_ROLE")]
        public required Role userRole{get;set;}

        [Column("USER_GENDER")]
        public required Gender userGender {get;set;}

    }
}