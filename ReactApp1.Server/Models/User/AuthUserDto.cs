using Newtonsoft.Json.Serialization;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;
using System.Security.Cryptography;
using System.Text;

namespace ReactApp1.Server.Models.User
{
    public class AuthUserDto
    {
        public string? email { get; set; }
        public string? password { get; set; }
        public ErrorModel? Error { get; set; }
    }
}
