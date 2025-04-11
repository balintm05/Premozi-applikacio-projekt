
# Premozi

A modern mozizás élményét fejlesztjük egy innovatív, felhasználóbarát online jegyfoglaló rendszerrel, amely lehetővé teszi a mozijegyek gyors és kényelmes foglalását. Projektünk célja, hogy a felhasználók könnyedén tallózhassanak a filmek és vetítések közt, kiválaszthassák kedvenc helyüket a teremben, majd lefoglalhassák a jegyeket – mindezt egy reszponzív, modern felületen.


## Fejlesztők

- [Bató Bence](https://www.github.com/ktjisebojtioeskotbwioi)
- [Magyarósi Bálint](https://github.com/balintm05)


## Telepítés

A projekt futtatásához szükséges programok:
- Visual Studio 2022
- XAMPP

A projekt klónozása után, nyissa meg a Visual Studio 2022-ben a terminált, majd a következő csomagokat telepítse, ha nincsenek vagy problémát okoznak:

```bash
  npm install react-router-dom
  npm install @emotion/react@11.14.0
  npm install @emotion/styled@11.14.0
  npm install @mui/material@7.0.1
  npm install axios@1.8.4
  npm install bootstrap@5.3.3
  npm install flowbite-react@0.10.2
  npm install jquery@3.7.1
  npm install popper.js@1.16.1
  npm install react-bootstrap@2.10.9
  npm install react-cookie@7.2.2
  npm install react-icons@5.5.0
  npm install react-native@0.78.0
  npm install react-router-dom@7.5.0
  npm install typescript-cookie@1.0.6
  npm install universal-cookie@7.2.2

```
Illetve a Visual Studio 2022-ben a következő NuGet csomagokat is telepítse, ha nincsenek vagy problémát okoznak:

```
BCrypt.Net-Next 4.0.3
Microsoft.AspNetCore.Authentication.JwtBearer 8.0.2
Microsoft.AspNetCore.Mvc.NewtonsoftJson 8.0.2
Microsoft.AspNetCore.SpaProxy 8.0.2
Microsoft.EntityFrameworkCore 8.0.2
Microsoft.EntityFrameworkCore.Design 8.0.2
Microsoft.EntityFrameworkCore.Tools 8.0.2
Microsoft.IdentityModel.JsonWebTokens 8.6.1
Microsoft.NET.Test.Sdk 17.13.0
Microsoft.VisualStudio.Web.CodeGeneration 8.0.2
Moq 4.20.72
MySql.Data 8.0.20
MySql.Data.EntityFramework 8.0.20
NUnit 4.3.2
NUnit3TestAdapter 5.0.0
Pomelo.EntityFrameworkCore.MySql 8.0.2
SendGrid 9.29.3
SixLabors.ImageSharp 3.1.7
Swashbuckle.AspNetCore 6.6.2
System.Linq.Async 6.0.1
xunit 2.9.3
xunit.runner.visualstudio 3.0.2

```
## Helyi futtatás
Ha a program és a függőségek telepítése kész, indítsa el Visual Studio 2022-ben az F5 gomb megnyomásával, vagy a https gombra.

(a szerver komponensnek kell kiválasztva lennie, ha nem indul el, akkor:

  -> start melletti leugró ablak -> Configure Startup Projects -> Multiple startup projects -> 
  
      -> felül: project: ReactApp.Server, action: Start, debug target: https
      -> alul: project: reactapp.client, action: Start, debug target: üres

  -> Alkalmaz -> Current Selection -> Alkalmaz

Ezután sikeresen el fog indulni a program.)


Emellett egy indító BAT fájl is mellékelve van, de annak működése a tanúsítványok miatt inkonzisztens, úgyhogy nem javasolt. 

Ha a program elindult, csak másolja ki a linket a terminálból, vagy innét:
```
https://localhost:60769/
```
## Dokumentáció

[Dokumentáció](https://github.com/balintm05/ReactApp1szenvedes/blob/master/dokument%C3%A1ci%C3%B32%20(2).docx)


# Funkciók

### Felhasználói felület
- Regisztráció és bejelentkezés – Biztonságos fiókkezelés kétlépcsős azonosítással, megerősítő emailekkel.
- Filmek böngészése – Áttekinthető lista a aktuális filmekről.
- Vetítések – Időpontok és a hozzájuk tartozó ülésrend megtekintése.
- Székválasztás- és foglalás – Interaktív térkép a moziteremről és a foglalások állapotáról valós időben.
- Email értesítések – Sikeres foglalásról és fontos információkról automatikus értesítés.

### Adminisztrációs felület
- Filmek, termek, vetítések kezelése – Új vetítések hozzáadása és meglévők szerkesztése.
- Székek konfigurálása – Moziterem elrendezés testreszabása.
- Felhasználók kezelése – Regisztrált felhasználók listája és admin jogosultságok.

# API Reference
## Felhasználókezelés (AuthController)

### Bejelentkezés
POST /api/auth/login

### Regisztráció
POST /api/auth/register

### Email cím megerősítése
GET /api/auth/confirm-email

### 2FA kód ellenőrzése
POST /api/auth/verify-email-2fa

### Új 2FA kód küldése
POST /api/auth/resend-2fa-code

### 2FA engedélyezése
POST /api/auth/enable-email-2fa

### 2FA letiltása
POST /api/auth/disable-email-2fa

### Felhasználó adatainak lekérése
GET /api/auth/getUser

### Felhasználó adatainak lekérése (admin)
GET /api/auth/getUserAdmin/${id}
| Paraméter | Típus     | Leírás                        |
| :-------- | :------- | :------------------------------|
| id        | integer    | Kötelező. A felhasználó ID-ja |

### Összes felhasználó lekérése (admin)
GET /api/auth/get

### Felhasználók szűrése (admin)
POST /api/auth/queryUsers

### Felhasználó adatainak módosítása
PATCH /api/auth/editUser

### Felhasználó adatainak módosítása (admin)
PATCH /api/auth/editUserAdmin

### Jelszó módosítása
PATCH /api/auth/editPassword

### Bejelentkezési állapot ellenőrzése
GET /api/auth/checkIfLoggedIn

### Kijelentkezés
DELETE /api/auth/logout

### Admin jogosultság ellenőrzése
POST /api/auth/checkIfAdmin

### Felhasználó törlése
DELETE /api/auth/deleteUser/${id}
| Paraméter | Típus     | Leírás                        |
| :-------- | :------- | :------------------------------|
| id        | integer    | Kötelező. A felhasználó ID-ja |


## Filmek kezelése (FilmController)

### Filmek szűrése
POST /api/film/query

### Összes film lekérése
GET /api/film/get

### Film lekérése ID alapján
GET /api/film/get/${id}
| Paraméter | Típus     | Leírás                 |
| :-------- | :------- | :-----------------------|
| id        | integer    | Kötelező. A film ID-ja |

### Új film hozzáadása (admin)
POST /api/film/add

### Film módosítása (admin)
PATCH /api/film/edit

### Film törlése (admin)
DELETE /api/film/delete/${id}
| Paraméter | Típus      | Leírás                 |
| :-------- | :-------   | :----------------------|
| id        | integer    | Kötelező. A film ID-ja |


## Foglalások kezelése (FoglalasController)

### Jegytípusok lekérése
GET /api/foglalas/getJegyTipus

### Összes foglalás lekérése (admin)
GET /api/foglalas/get

### Foglalások lekérése vetítés alapján
GET /api/foglalas/getByVetites/${vid}
| Paraméter | Típus     | Leírás                    |
| :-------- | :------- | :--------------------------|
| vid       | integer    | Kötelező. A vetítés ID-ja |

### Foglalások lekérése felhasználó alapján
GET /api/foglalas/getByUser/${uid}
| Paraméter | Típus     | Leírás                        |
| :-------- | :------- | :------------------------------|
| uid       | integer    | Kötelező. A felhasználó ID-ja |

### Új foglalás létrehozása
POST /api/foglalas/add

### Foglalás módosítása
PATCH /api/foglalas/edit

### Foglalás törlése
DELETE /api/foglalas/delete/${id}
| Paraméter | Típus     | Leírás                     |
| :-------- | :------- | :---------------------------|
| id        | integer    | Kötelező. A foglalás ID-ja |


## Termek kezelése (TeremController)

### Összes terem lekérése
GET /api/terem/get

### Terem lekérése ID alapján
GET /api/terem/get/${id}
| Paraméter | Típus     | Leírás                  |
| :-------- | :------- | :------------------------|
| id        | integer    | Kötelező. A terem ID-ja |

### Új terem hozzáadása (admin)
POST /api/terem/add

### Terem módosítása (admin)
PATCH /api/terem/edit

### Terem törlése (admin)
DELETE /api/terem/delete/${id}
| Paraméter | Típus     | Leírás                  |
| :-------- | :------- | :------------------------|
| id        | integer    | Kötelező. A terem ID-ja |


## Vetítések kezelése (VetitesController)

### Összes vetítés lekérése
GET /api/vetites/get

### Vetítés lekérése ID alapján
GET /api/vetites/get/${id}
| Paraméter | Típus     | Leírás                    |
| :-------- | :------- | :--------------------------|
| id        | integer    | Kötelező. A vetítés ID-ja |

### Új vetítés hozzáadása (admin)
POST /api/vetites/add

### Vetítés módosítása (admin)
PATCH /api/vetites/edit

### Vetítés törlése (admin)
DELETE /api/vetites/delete/${id}
| Paraméter | Típus     | Leírás                    |
| :-------- | :------- | :--------------------------|
| id        | integer    | Kötelező. A vetítés ID-ja |

###
