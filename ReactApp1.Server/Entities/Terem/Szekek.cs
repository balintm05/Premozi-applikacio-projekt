﻿using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace ReactApp1.Server.Entities.Terem
{
    [PrimaryKey("Terem", "X", "Y")]
    public class Szekek
    {
        [Column(TypeName = "int(2)"), NotNull]
        public int X { get; set; }
        [Column(TypeName = "int(2)"), NotNull]
        public int Y { get; set; }
        [Column(TypeName = "int(1)"), NotNull]
        public int Allapot { get; set; } = 1;
        public virtual Terem Terem { get; set; } = null!;
    }
}
