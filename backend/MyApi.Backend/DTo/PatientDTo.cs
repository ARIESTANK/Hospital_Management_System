using MyApi.Backend.Enum;
using MyApi.Backend.Models;

namespace MyApi.Backend.DTOs
{
    

    public class CreatePatientDto
    {
        public required string name { get; set; }
        public required string gender    { get; set; }
        public required int age { get; set; }
        public required string   hcase     { get; set; }
        public required string status { get; set; }

    }

    
}