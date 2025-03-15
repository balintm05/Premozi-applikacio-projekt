using Newtonsoft.Json.Serialization;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;
using System.Security.Cryptography;
using System.Text;

namespace ReactApp1.Server.Entities
{
    [PrimaryKey("userID")]
    public class User
    {
        [Key, Column(TypeName = "int(11)"), DatabaseGenerated(DatabaseGeneratedOption.Identity), NotNull, Required, Editable(false)]
        public int userID { get; private set; }
        [Column(TypeName = "varchar(100)"), DataType(DataType.EmailAddress), NotNull, Required]
        public string email { get; set; }
        //sha-512 hex
        [Column(TypeName = "char(84)"), Length(84, 84), DataType(DataType.Password), NotNull, Required]
        public string passwordHash { get; set; }
        [Column(TypeName = "DateTime"), DataType(DataType.DateTime), Editable(false), NotNull, Required]
        public DateTime creationDate { get; set; } = DateTime.UtcNow;
        [Column(TypeName = "int(1)"), MaxLength(1), MinLength(1), NotNull, Required]
        public int accountStatus { get; set; } = 1;
        [Column(TypeName = "varchar(30)"), MaxLength(1), MinLength(1), NotNull, Required]
        public string role { get; set; } = "User";
        [Column(TypeName = "longtext"), NotNull, DataType(DataType.Text)]
        public string Megjegyzes { get; set; } = "";
        [Column(TypeName = "varchar(100)")]
        public string? refreshToken { get; set; }
        [Column(TypeName = "DateTime")]
        public DateTime? refreshTokenExpiry { get; set; }
    }
}
