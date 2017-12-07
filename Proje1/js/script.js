var mainContent = $("#mainContent");
// kutu htmlinin patterni
var boxPattern = '<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12"><div class="box text-center"><a href="#" onclick="{{function}}"><img class="img-responsive center-block" src="{{image}}"></a><h2>{{title}}</h2></div></div>';
// profile kutularinin patterini
var profilePattern = '<div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 media"><div class="media-left media-middle"><a href="#"><img class="media-object" src="{{image}}"></a></div><div class="media-body">{{description}}</div></div>';
var tablePattern = '<table class="table table-bordered"><thead><tr><th>Saat</th><th>Pazartesi</th><th>Salı</th><th>Çarşamba</th><th>Perşembe</th><th>Cuma</th></tr></thead><tbody>{{rows}}</tbody></table>';

// personel sayfasini cekmek icin fonksiyon
function getPersonel() {
	
	var html = '<h2 class="text-center">Personel</h2>'; // başlık yazısı
	html += box("getUyeler('ogretim');", "img/ogretimUyesi.jpg", "Öğretim Üyeleri");
	html += box("getUyeler('akademikYardimci');", "img/akademikYardimci.jpg", "Akademik Yardımcı");
	html += box("getUyeler('idariTeknik');", "img/idariTeknik.jpg", "İdari Teknik");

	inject(html); // mainContent e inject yapiliyor
}


// öğretim üyelerinin listemek için fonksiyon
function getUyeler(type) {

	var title = "İdari Teknik"; // başlık
	var key = "idariTeknik"; // jsondaki key

	if (type == "ogretim") {
		title = "Öğretim Üyeleri";
		key = "ogretimUyeleri";
	} else if (type == "akademikYardimci") {
		title = "Akademik Yardımcı";
		key = "akademikYardimci";
	}

	var html = '<h2 class="text-center">' + title + '</h2>'; // mainContentdeki başlık yazısı
	getJson("json/personel.json", function (data) {	 // json isteği atiliyor
		data[key].forEach(function (uye) { // kişiler dizisi dolaşılıyor
			var desc = "Ad: " + uye.ad + "<br>Soyad: " + uye.soyad + "<br>Dal: " + uye.dal; // kişinin özellikleri biriktiriliyor 
			html += profile("img/profiles/" + uye.foto, desc); // kişi kutucuklari uç uca ekleniyor
		});

		inject(html); // mainContent e inject oluyor
	});
}

// eğitim durumunu listelemek için fonksiyon
function getEgitim() {
	var html = '<h2 class="text-center">Eğitim</h2>'; // başlık yazısı
	html += box("getDonem('lisans');", "img/lisans.jpg", "Lisans");
	html += box("getDonem('ylisans');", "img/ylisans.jpg", "Yüksek Lisans");

	inject(html);
}

// dönemi listelemek için fonksiyon
function getDonem(egitim) {
	var html = '<h2 class="text-center">Dönem</h2>'; // başlık yazısı
	if (egitim == "lisans") {
		html += box("getSinif('guz')", "img/güz.jpg", "Güz");
		html += box("getSinif('bahar')", "img/bahar.jpg", "Bahar");
	} else {
		html += box("getProgram('ylisans', '1', 'guz')", "img/güz.jpg", "Güz");
		html += box("getProgram('ylisans', '1', 'bahar')", "img/bahar.jpg", "Bahar");
	}

	inject(html);
}

// sınıfları listelemek için fonksiyon
function getSinif(donem) {
	var html = '<h2 class="text-center">Sınıf</h2>'; // başlık yazısı
	html += box("getProgram('lisans', '1', '" + donem + "')", "img/1.jpg", "1. Sınıf");
	html += box("getProgram('lisans', '2', '" + donem + "')", "img/2.jpg", "2. Sınıf");
	html += box("getProgram('lisans', '3', '" + donem + "')", "img/3.jpg", "3. Sınıf");
	html += box("getProgram('lisans', '4', '" + donem + "')", "img/4.jpg", "4. Sınıf");

	inject(html);
}

// ders programını listelemek için fonksiyon
function getProgram(egitim, sinif, donem) {
	var html = '<h2 class="text-center">Ders Programı</h2>'; // başlık yazısı
	getJson("json/egitim.json", function (data) {
		var haftalikDersler = data[egitim][donem][sinif-1]; // filtrelere göre haftalık ders programını alıyoruz
		
		var rows = "";
		haftalikDersler.forEach(function (saatlikDersler, saat) { // saatlere göre alıyoruz
			var row = '<tr>';
			row += '<td>Aralık ' + (saat+1) + "</td>"; // ilk col
			saatlikDersler.forEach(function (ders) { // row, derslerle dolduruluyor
				row += '<td>' + ders + '</td>';
			});
			row += "</tr>";
			rows += row;
		});

		inject(table(rows)); // table inject ediliyor
	});
}

// sayfalardaki kutularin patternlerine gore html dondurmek icin fonksiyon
function box(func, image, title) {
	return boxPattern.replace("{{function}}", func).replace("{{image}}", image).replace("{{title}}", title); // pattern üzerinde değişiklik yapılıyor
}

// profil kutularin patternlerine gore html dondurmek icin fonksiyon
function profile(image, description) {
	return profilePattern.replace("{{image}}", image).replace("{{description}}", description); // pattern üzerinde değişiklik yapılıyor
}

// ders programındaki tabloyu oluşturuyor
function table(rows) {
	return tablePattern.replace("{{rows}}", rows); // pattern üzerinde satırları inject ediyor
}

// ajax sorgulari yapmak icin fonksiyon
function getJson(url, callback) {
	$.ajax({ 
	    type: 'GET', // get methodu kullanılarak json dosyası çekiliyor
	    url: url,  // egitim.json veya personal.json olabilir
	    dataType: 'json', // veriyi json parse ederek alıyoruz
	    success: callback // callback fonksiyonuna data ile beraber yolluyoruz
	});
}

// mainContent e inject yapmak icin fonksiyon
function inject(data) {
	mainContent.html(data); // mainContent html içeriği data ile değiştiriliyor
}