import express from "express"
import mysql from "mysql"
import cors from "cors"

const app = express()

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "project"
})

// if there is a auth problem
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
  const tables = "SHOW TABLES;"

  db.query(tables, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})

// menu
app.get("/menu", (req, res) => {
  const menu = "SELECT*FROM menu";

  db.query(menu, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})

// bahan baku
app.get("/bahanbaku", (req, res) => {
  const bb = "SELECT*FROM bahanbaku";

  db.query(bb, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})

// add bahan baku pusat
app.post("/bahanbaku", (req, res) => {
  const addbb = "INSERT INTO bahanbaku (`id_bahan`, `bahanbaku`, `stock`, `tanggal_update`, `keterangan`) VALUES (?)";
  const values = [
    req.body.id_bahan,
    req.body.bahanbaku,
    req.body.stock,
    req.body.tanggal_update,
    req.body.keterangan
  ];

  db.query(addbb, [values], (err, data) => {
    if (err) return res.json(err)
    return res.json("bahanbaku berhasil ditambah")
  })
})

// delete bahanbaku
app.delete("/bahanbaku/:id_bahan", (req, res) => {
  const id_bahan = req.params.id_bahan; // Access the id_bahan from req.params

  const deleteQuery1 = `DELETE FROM bahanbaku WHERE id_bahan = ?;`;
  const deleteQuery2 = `DELETE FROM bahanbaku_mitra1 WHERE id_bahan = ?;`;
  const deleteQuery3 = `DELETE FROM bahanbaku_mitra2 WHERE id_bahan = ?;`;

  // Perform the delete queries sequentially
  db.query(deleteQuery1, [id_bahan], (err1, result1) => {
    if (err1) {
      console.log(err1);
      return res.status(500).json({ message: "Failed to delete data" });
    }
    console.log("Data from bahanbaku deleted successfully");

    db.query(deleteQuery2, [id_bahan], (err2, result2) => {
      if (err2) {
        console.log(err2);
        return res.status(500).json({ message: "Failed to delete data" });
      }
      console.log("Data from bahanbaku_mitra1 deleted successfully");

      db.query(deleteQuery3, [id_bahan], (err3, result3) => {
        if (err3) {
          console.log(err3);
          return res.status(500).json({ message: "Failed to delete data" });
        }
        console.log("Data from bahanbaku_mitra2 deleted successfully");

        // Send response after all deletions are successful
        res.status(200).json({ message: "Data deleted successfully" });
      });
    });
  });
});



// Data_mitra
app.get("/data_mitra", (req, res) => {
  const dm = "SELECT*FROM data_mitra";

  db.query(dm, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})

// karena ada trigger nanti bahan baku mitra 1 dan 2 otomatis ditambah sesuai bahan baku pusat
// bahanbaku_mitra1
app.get("/bahanbaku_mitra1", (req, res) => {
  const bbm1 = "SELECT*FROM bahanbaku_mitra1";

  db.query(bbm1, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})

// bahanbaku_mitra2
app.get("/bahanbaku_mitra2", (req, res) => {
  const bbm2 = "SELECT*FROM bahanbaku_mitra2";

  db.query(bbm2, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})

// update bahanbaku_mitra1
app.put("/bahanbaku_mitra1/:id_bahan", (req, res) => {
  const idbbm1 = req.params.id_bahan;
  const ubbm1 = "UPDATE bahanbaku_mitra1 SET `stock` = ? WHERE id_bahan = ?";

  const values = req.body.stock;

  db.query(ubbm1, [values, idbbm1], (err, data) => {
    if (err) return res.json(err)
    return res.json("Bahan baku mitra 1 berhasil di update")
  })
})

// update bahanbaku_mitra2
app.put("/bahanbaku_mitra2/:id_bahan", (req, res) => {
  const idbbm2 = req.params.id_bahan;
  const ubbm2 = "UPDATE bahanbaku_mitra2 SET `stock` = ? WHERE id_bahan = ?";

  const values = req.body.stock;

  db.query(ubbm2, [values, idbbm2], (err, data) => {
    if (err) return res.json(err)
    return res.json("Bahan baku mitra 2 berhasil di update")
  })
})

// stok_menipis
app.get("/stok_menipis", (req, res) => {
  const sm = "SELECT*FROM stok_menipis";

  db.query(sm, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})

// penjualanmenu_mitra1
app.get("/penjualanmenu_mitra1", (req, res) => {
  const pm1 = "SELECT*FROM penjualanmenu_mitra1";

  db.query(pm1, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})

// input penjualanmenu_mitra1
app.post("/penjualanmenu_mitra1", (req, res) => {
  const addpmm1 = "INSERT penjualanmenu_mitra1 (`id_mitra`, `id_menu`, `menu`, `total_terjual`) VALUES (?)";
  const values = [
    req.body.id_mitra,
    req.body.id_menu,
    req.body.menu,
    req.body.total_terjual
  ];

  db.query(addpmm1, [values], (err, data) => {
    if (err) return res.json(err)
    return res.json("input penjualan sukses")
  })
})


// penjualanmenu_mitra2
app.get("/penjualanmenu_mitra2", (req, res) => {
  const pm2 = "SELECT*FROM penjualanmenu_mitra2";

  db.query(pm2, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})

// input penjualanmenu_mitra2
app.post("/penjualanmenu_mitra2", (req, res) => {
  const addpmm2 = "INSERT penjualanmenu_mitra2 (`id_mitra`, `id_menu`, `menu`, `total_terjual`) VALUES (?)";
  const values = [
    req.body.id_mitra,
    req.body.id_menu,
    req.body.menu,
    req.body.total_terjual
  ];

  db.query(addpmm2, [values], (err, data) => {
    if (err) return res.json(err)
    return res.json("input penjualan sukses")
  })
})

// penjualanmenu_total
app.get("/penjualanmenu_total", (req, res) => {
  const pmt = "SELECT*FROM penjualanmenu_total";

  db.query(pmt, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})

// menu favorit
app.get("/menu_favorit", (req, res) => {
  const mf = "SELECT*FROM menu_favorit";

  db.query(mf, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})

// hasiljual_mitra1
app.get("/hasiljual_mitra1", (req, res) => {
  const hjm1 = "SELECT*FROM hasiljual_mitra1";

  db.query(hjm1, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})

//inpu hasiljuak_mitra1
app.post("/hasiljual_mitra1", (req, res) => {
  const ihjm1 = "INSERT hasiljual_mitra1 (`id_mitra`, `tahun`, `Q1`, `Q2`, `Q3`, `Q4`) VALUES (?)";
  const values = [
    req.body.id_mitra,
    req.body.tahun,
    req.body.Q1,
    req.body.Q2,
    req.body.Q3,
    req.body.Q4
  ];

  db.query(ihjm1, [values], (err, data) => {
    if (err) return res.json(err)
    return res.json("input hasil jual mitra 1 sukses")
  })
})

// delete hasiljual_mitra1
app.delete("/hasiljual_mitra1/:id_mitra/:tahun", (req, res) => {
  const { id_mitra, tahun } = req.params;
  const deleteQuery1 = `DELETE FROM hasiljual_mitra1 WHERE id_mitra = ? AND tahun = ?;`;
  const deleteQuery2 = `DELETE FROM hasil_penjualan WHERE id_mitra = ? AND tahun = ?;`;
  const deleteQuery3 = `DELETE FROM pendapatan WHERE id_mitra = ? AND tahun = ?;`;
  const deleteQuery4 = `DELETE FROM analisis_mitra WHERE id_mitra = ? AND tahun = ?;`;

  db.query(deleteQuery1, [id_mitra, tahun], (err1, result1) => {
    if (err1) {
      console.log(err1);
      res.status(500).json({ message: "Failed to delete data" });
    } else {
      console.log("Data deleted successfully");
      db.query(deleteQuery2, [id_mitra, tahun], (err2, result2) => {
        if (err2) {
          console.log(err2);
          res.status(500).json({ message: "Failed to delete data" });
        } else {
          console.log("Data deleted successfully");
          db.query(deleteQuery3, [id_mitra, tahun], (err3, result3) => {
            if (err3) {
              console.log(err3);
              res.status(500).json({ message: "Failed to delete data" });
            } else {
              console.log("Data deleted successfully");
              db.query(deleteQuery4, [id_mitra, tahun], (err4, result4) => {
                if (err4) {
                  console.log(err4);
                  res.status(500).json({ message: "Failed to delete data" });
                } else {
                  console.log("Data deleted successfully");
                  res.status(200).json({ message: "Data deleted successfully" });
                }
              });
            }
          });
        }
      });
    }
  });
});

// hasiljual_mitra2
app.get("/hasiljual_mitra2", (req, res) => {
  const hjm2 = "SELECT*FROM hasiljual_mitra2";

  db.query(hjm2, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})

//inpu hasiljuak_mitra2
app.post("/hasiljual_mitra2", (req, res) => {
  const ihjm2 = "INSERT hasiljual_mitra2 (`id_mitra`, `tahun`, `Q1`, `Q2`, `Q3`, `Q4`) VALUES (?)";
  const values = [
    req.body.id_mitra,
    req.body.tahun,
    req.body.Q1,
    req.body.Q2,
    req.body.Q3,
    req.body.Q4
  ];

  db.query(ihjm2, [values], (err, data) => {
    if (err) return res.json(err)
    return res.json("input hasil jual mitra 2 sukses")
  })
})

// delete hasiljual_mitra2
app.delete("/hasiljual_mitra2/:id_mitra/:tahun", (req, res) => {
  const { id_mitra, tahun } = req.params;
  const deleteQuery1 = `DELETE FROM hasiljual_mitra2 WHERE id_mitra = ? AND tahun = ?;`;
  const deleteQuery2 = `DELETE FROM hasil_penjualan WHERE id_mitra = ? AND tahun = ?;`;
  const deleteQuery3 = `DELETE FROM pendapatan WHERE id_mitra = ? AND tahun = ?;`;
  const deleteQuery4 = `DELETE FROM analisis_mitra WHERE id_mitra = ? AND tahun = ?;`;

  db.query(deleteQuery1, [id_mitra, tahun], (err1, result1) => {
    if (err1) {
      console.log(err1);
      res.status(500).json({ message: "Failed to delete data" });
    } else {
      console.log("Data deleted successfully");
      db.query(deleteQuery2, [id_mitra, tahun], (err2, result2) => {
        if (err2) {
          console.log(err2);
          res.status(500).json({ message: "Failed to delete data" });
        } else {
          console.log("Data deleted successfully");
          db.query(deleteQuery3, [id_mitra, tahun], (err3, result3) => {
            if (err3) {
              console.log(err3);
              res.status(500).json({ message: "Failed to delete data" });
            } else {
              console.log("Data deleted successfully");
              db.query(deleteQuery4, [id_mitra, tahun], (err4, result4) => {
                if (err4) {
                  console.log(err4);
                  res.status(500).json({ message: "Failed to delete data" });
                } else {
                  console.log("Data deleted successfully");
                  res.status(200).json({ message: "Data deleted successfully" });
                }
              });
            }
          });
        }
      });
    }
  });
});

// hasil_penjualan
app.get("/hasil_penjualan", (req, res) => {
  const hp = "SELECT*FROM hasil_penjualan";

  db.query(hp, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})

// pendapatan
app.get("/pendapatan", (req, res) => {
  const pendapatan = "SELECT*FROM pendapatan";

  db.query(pendapatan, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})

//target pendapatan
app.get("/target_pendapatan", (req, res) => {
  const tpQuery = "SELECT * FROM target_pendapatan";

  db.query(tpQuery, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// mencapai_target
app.get("/target_pendapatan/mencapai_target", (req, res) => {
  const mencapaiTpQuery = `
    SELECT id_mitra,
tahun,
    (SELECT CASE WHEN Q1 >= Q1_target THEN 'Mencapai Target' ELSE '-' END FROM target_pendapatan WHERE target_pendapatan.id_mitra = pendapatan.id_mitra) AS Q1,
    (SELECT CASE WHEN Q2 >= Q2_target THEN 'Mencapai Target' ELSE '-' END FROM target_pendapatan WHERE target_pendapatan.id_mitra = pendapatan.id_mitra) AS Q2,
    (SELECT CASE WHEN Q3 >= Q3_target THEN 'Mencapai Target' ELSE '-' END FROM target_pendapatan WHERE target_pendapatan.id_mitra = pendapatan.id_mitra) AS Q3,
    (SELECT CASE WHEN Q4 >= Q4_target THEN 'Mencapai Target' ELSE '-' END FROM target_pendapatan WHERE target_pendapatan.id_mitra = pendapatan.id_mitra) AS Q4
FROM pendapatan;
  `;
  db.query(mencapaiTpQuery, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// analisis_mitra
app.get("/analisis_mitra", (req, res) => {
  const am = "SELECT*FROM analisis_mitra";

  db.query(am, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})

app.listen(8800, () => {
  console.log("Connected to backend!")
})