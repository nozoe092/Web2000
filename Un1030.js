//
// [UN1030] 請求書管理
// Un1030.js
// 


function jskensaku(strShori_shubetu) {
    var frm = document.FIND;
    if ( ! icheck() ) { return; }
	frm.shori_shubetu.value = strShori_shubetu;
    frm.submit();
}

function icheck() {
    var frm = document.FIND;
	
    // 日付
	with (frm) {	
		// 日付開始
		var chkdateST = S_HIDUKE_ST_y.options[S_HIDUKE_ST_y.selectedIndex].value
					+ S_HIDUKE_ST_m.options[S_HIDUKE_ST_m.selectedIndex].value
					+ S_HIDUKE_ST_d.options[S_HIDUKE_ST_d.selectedIndex].value;	
		S_HIDDEN_HIDUKE_ST.value = chkdateST;
		
		// 日付終了
		var chkdateED = S_HIDUKE_ED_y.options[S_HIDUKE_ED_y.selectedIndex].value
					+ S_HIDUKE_ST_m.options[S_HIDUKE_ED_m.selectedIndex].value
					+ S_HIDUKE_ST_d.options[S_HIDUKE_ED_d.selectedIndex].value;
		S_HIDDEN_HIDUKE_ED.value = chkdateED;
	
		//日付指定の検索の場合
    	if (!cmnCheckDate(chkdateST)) { alert( MSG_0004);S_HIDUKE_ST_y.focus();return false; } // MSG
		if (!cmnCheckDate(chkdateED)) { alert( MSG_0004);S_HIDUKE_ED_y.focus();return false; } // MSG
		
    	// 日付の妥当性チェック
		if (chkdateST > chkdateED) { alert( MSG_0004);S_HIDUKE_ST_y.focus();return false; } // MSG
	    			
	}	    			
    
    return true;
}


// 箇所選択ダイアログ表示
function OpenDlg070(dlg)
{

	// 箇所選択ダイアログパラメータセット
	with (dlg) {
		SelectKasyoCode.value = document.FIND.T_TOKUI_CD.value;
		SelectKasyoName.value = document.FIND.T_TOKUI_NAME.value;
		TokuisakiFlg.value = "1";
		KaishaKbn.value = "13";
		//売上入金画面から呼ばれた場合、販売店(全て)　& メーカー(サンリッチ取引有り)　を抽出
		//UriageNyukinFlag.value  ='1';
		//売上入金画面から呼ばれた場合、販売店(全て)　& メーカー　を抽出
		UriageNyukinFlag.value  ='2';
		
        
	}

	// 箇所選択ダイアログ表示
	OpenDialogWindow(document.dlg070);   // in common dialog script
}

// 箇所選択ダイアログリターン
function getDlg070Parameters()
{

	// リターン：会社コード、得意先コード、得意先名、箇所コード、箇所名
	if ( getDlg070Parameters.arguments.length == 0 ){
		return;
	}
	var colarray = getDlg070Parameters.arguments[0];    // リターン配列
	var index = CommonDialogSaveParameters;             // セットする行番号
	with (document.FIND)
	{

//		colarray[0] ：会社コード
//		colarray[1] ：得意先コード
//		colarray[2] ：得意先名
//		colarray[3] ：箇所コード
//		colarray[4] ：箇所名


		// 得意先コード、得意先名を検索条件にセット
		T_TOKUI_CD.value = colarray[1];		// 得意先コード
		T_TOKUI_NAME.value = colarray[2];		// 得意先名
    	selHanbaiFlg.value = '1';				// 選択フラグ
    }

}

// 販売店変更時
function changeHanbai() {
	// 選択フラグをクリアする
	//document.kensaku.selHanbaiFlg.value = '';
	document.FIND.selHanbaiFlg.value = '';
}

//各種ボタンクリック時 
//syori_syubetu 
// 2:削除// 5:内容確認 // 1:受注内訳表示// 6:印刷 // 7:合計請求書作成 // 8:印刷(分割)
function jump(param,shori_shubetu,name) {

	var SeikyuNo="";
	var SkNo_ShubetsuCd="";
	var ChkNo=0;
	var i;	
	var SeikyuSakiNm_back="";
	var TokuiSakiCd_back="";
	var SeikyuSakiNm="";
	var TokuiSakiCd="";
	var SeikyuSskiFlg="";
	var TokuiSskiFlg="";
	var SeikyushoShubetsu="";
	var SeikyushoShubetsuFlg="";
	var OyaSeikyuNo="";
	var TaxKbn="";
	var TaxKbn_back="";
	var Taxflg="";
	var SKNo="";	
	var sSTATUS=""; //内容確認ボタンからの起動　 (　1:親無しの単票 2:親の単票 3:子の単票 4:入金済 5:支払作成済)
	var sPrintYmd="";
	var NyukinFlg="";	
	//2011/04/28 add KUBO START ----------    
	var sDelYmd="";			//請求書を削除済みかどうか	    	                  	
    //2011/04/28 add KUBO END -----------

	//2011/06/17 add KUBO  支払作成済みかどうか
	var ShihraiNo="";			
	//2014/05/23  START ------
	var Delflg1= "";
	//2014/05/23  END ------
					
	//------------処理種別固有の処理------------------
	//削除ボタン・内容確認・印刷
	if (shori_shubetu=='2' || shori_shubetu=='5' || shori_shubetu=='1' || shori_shubetu=='6' || shori_shubetu=='7' || shori_shubetu=='8' ){
		
		//経理担当以外は、削除できない
		//入金済みは削除できない。
		if(document.RESULT.SkCheck.length) {
			for(i = 0; i < document.RESULT.SkCheck.length; i++) {			
				if(document.RESULT.SkCheck[i].checked) {
					SeikyuNo = document.RESULT.SkCheck[i].value;   		//請求書NO_請求書種別
					SKNo = document.RESULT.LIST_SEIKYUNO[i].value; 		//請求書NO				
					if (NyukinFlg==""){
						NyukinFlg = document.RESULT.LIST_NyukinFlg[i].value; 		//入金済みフラグ
					}
					
					if (SkNo_ShubetsuCd==""){
						SkNo_ShubetsuCd = document.RESULT.SkCheck[i].value;
					}
					ChkNo = parseInt(ChkNo)  + 1;
					//合計請求書(得意先・請求先が同じかどうか)
					if (SeikyuSskiFlg =="" && TokuiSskiFlg ==""){
						SeikyuSakiNm = document.RESULT.LIST_SEIKYUSAKINM[i].value;   //請求先名
						TokuiSakiCd = document.RESULT.LIST_TOKUISAKICD[i].value;   //得意先名
						if (parseInt(ChkNo)>1){
							if (SeikyuSakiNm_back != SeikyuSakiNm){ SeikyuSskiFlg="1";}
							if (TokuiSakiCd_back != TokuiSakiCd){TokuiSskiFlg="1";}
						}
						
					}
					//合計請求書(消費税区分が同じかどうか)
					if (Taxflg ==""){
						TaxKbn = document.RESULT.LIST_TAXKBN[i].value;   				//消費税区分
					  	if (parseInt(ChkNo)>1){
							if (TaxKbn_back != TaxKbn){ Taxflg="1";}							
						}						
					}
					
					
					SeikyuSakiNm_back = document.RESULT.LIST_SEIKYUSAKINM[i].value; //請求先名
					TokuiSakiCd_back = document.RESULT.LIST_TOKUISAKICD[i].value;   //得意先名
					TaxKbn_back = document.RESULT.LIST_TAXKBN[i].value;   			//消費税区分
					
					SeikyushoShubetsu = document.RESULT.LIST_SEIKYUSHUBETSU[i].value;//請求書種別
					OyaSeikyuNo = document.RESULT.LIST_OYASEIKYUNO[i].value;   		//親請求書No
					
					if (ChkNo==1){sSTATUS="1";}  // 1:親無しの単票
					//合計請求書
					if (SeikyushoShubetsu == "9"){
						  if ( SeikyushoShubetsuFlg =="" ){SeikyushoShubetsuFlg="1";}					          
					      sSTATUS="2";// 2:親の単票
					}
					//合計請求書の子
					//alert(OyaSeikyuNo + "-" + SKNo);
					if (OyaSeikyuNo != SKNo){
					 	  if ( SeikyushoShubetsuFlg =="" ){SeikyushoShubetsuFlg="1";}
					 	  sSTATUS="3";  // 3:子の単票
					}
					//請求書を印刷済みかどうか
					if (sPrintYmd ==""){					    	
						sPrintYmd = document.RESULT.LIST_PrintYmd[i].value; //請求書印刷日
					}
					//2011/04/28 add KUBO START ----------
	                //請求書を削除済みかどうか
					if (sDelYmd ==""){					    	
						sDelYmd = document.RESULT.LIST_DelYmd[i].value; //削除日
					}					    	                  	
	                //2011/04/28 add KUBO END -----------
	                
                	//2011/06/17 add KUBO  支払作成済みかどうか
					if (ShihraiNo==""){
						ShihraiNo = document.RESULT.LIST_ShihraiNo[i].value; 		//支払作成済みフラグ
					}
			
					//2014/05/23  START ------
		            //請求日５／３１以前
				    //毎年7/１以降は、請求日５／３１以前はメッセージを表示して保存・削除ボタンを押せないようにする。
					sHidSeikyuYmd = document.RESULT.LIST_SeikyuYmd[i].value; 		//請求日
					var SMonth = HidukeHenkan(sHidSeikyuYmd).substring(4,6);
					var SYear  = HidukeHenkan(sHidSeikyuYmd).substring(0,4);
					if  (  1 <= parseInt(SMonth)  &&    parseInt(SMonth) <= 5 ){
					}else{
						SYear = parseInt(SYear) + 1;
					}
					if (  parseInt(SYear + "0801")   <=   parseInt(cmnGetTodayYYYYMMDD() )){
				           //alert("請求日のエラー　\n　7/１を過ぎていますので、請求日5/31以前で保存できません1");
				  	       Delflg1 = "1";
					}
				    //2014/05/23  END --------
				    
				}
			}
		} else {
			if(document.RESULT.SkCheck.checked) {
				SeikyuNo = document.RESULT.SkCheck.value;	       //請求書NO_請求書種別
				SkNo_ShubetsuCd = document.RESULT.SkCheck.value;	
				NyukinFlg = document.RESULT.LIST_NyukinFlg.value; 		//入金済みフラグ
				TokuiSakiCd = document.RESULT.LIST_TOKUISAKICD.value;   //得意先名  2011/04/20 add KUBO
				ChkNo =1;
				//2011/06/17 add KUBO  支払作成済みかどうか
				ShihraiNo = document.RESULT.LIST_ShihraiNo.value; 		//支払作成済みフラグ
					
				//2014/05/23  START ------
	            //毎年7/１以降は、請求日５／３１以前はメッセージを表示して保存・削除ボタンを押せないようにする。
			    //請求日５／３１以前
		    	sHidSeikyuYmd = document.RESULT.LIST_SeikyuYmd.value; 		//請求日
				var SMonth = HidukeHenkan(sHidSeikyuYmd).substring(4,6);
				var SYear  = HidukeHenkan(sHidSeikyuYmd).substring(0,4);
				if  (  1 <= parseInt(SMonth)  &&    parseInt(SMonth) <= 5 ){
				}else{
					SYear = parseInt(SYear) + 1;
				}
				if (  parseInt(SYear + "0801")   <=   parseInt(cmnGetTodayYYYYMMDD() )){
			           //alert("請求日のエラー　\n　7/１を過ぎていますので、請求日5/31以前で保存できません2");
			  	       Delflg1 = "1";
				}
			    //2014/05/23  END --------
			        
				    
			}
		}
		
		//------------処理種別固有のチェック処理----------------
		// チェックボックスが選択されていない場合
		if(SeikyuNo == undefined || SeikyuNo == '') {
			alert("請求Noを選択してください");
			return;
		}
		//合計請求書作成の場合
		if ( shori_shubetu=='7' ){
			//チェックの数
		    /*
		    if(parseInt(ChkNo) ==1){
		    	alert("合計請求書は、２つ以上を選択してください");
				return;
			}
			*/
			//2011/04/28 add KUBO START ----------
            //請求書を削除済みかどうか
			if (sDelYmd !=""){
				alert("削除されているため合計請求書を作成できません。");
				return;
			}						    	                  	
            //2011/04/28 add KUBO END -----------
			if(SeikyuSskiFlg=="1"){
				alert("同一の請求先でないため合計請求書は作成できません。");
				return;
			}
			if(TokuiSskiFlg=="1"){
				alert("同一の得意先でないため合計請求書は作成できません。");
				return;
			}			
			if(SeikyushoShubetsuFlg=="1"){
				alert("既に合計請求書が作成されているため、合計請求書は作成できません。");
				return;
			}			
			if(Taxflg=="1"){
				alert("消費税区分が異なるため、合計請求書は作成できません。");
				return;
			}
			//入金済の単票が分割又は、グループ可されているかもしれないので。
			if(NyukinFlg!==""){
				alert("入金済みのため合計請求書を作成できません。");
				return;
			}
			//2011/06/17 add KUBO  支払作成済は、支払番号が単票に紐付いているため
		　  if (ShihraiNo!=""){
		   		alert("支払データ作成済みのため合計請求書を作成できません。");
				return;
			}	
		   
            
		}
		//削除ボタン
		if (shori_shubetu=='2'){
		   if (sSTATUS == "3"){ // 3:子の単票
		      alert("合計請求書の単票は削除できません。合計請求書を削除後、合計請求書を再作成してください。");
		      return;
		   }
		   //入金済みは削除できない。
		   if (NyukinFlg!=""){
		   	  alert("入金済みのため削除できません。");
		      return;
		   }
		   //2011/06/17 add KUBO  支払作成済みは削除できない。
		　    if (ShihraiNo!=""){
		   	  alert("支払データ作成済みのため削除できません。支払データを削除後、支払データを再作成してください。");
		      return;
		   }		
		   //2014/05/23  START ------
           //毎年7/１以降は、請求日５／３１以前はメッセージを表示して保存・削除ボタンを押せないようにする。
		   if (Delflg1!=""){
		   	  alert("決算が完了していますので、請求日が5/31以前のデータは削除できません。");
		   	  return;
		   }		
		   //2014/05/23  END --------
		   		
		}
		//5:内容確認 
		if ( shori_shubetu=='5' ){
			//チェックの数
		    if(parseInt(ChkNo) >1){
		    	alert("内容確認 は、１件しか選択できません");
				return;
			}
		}
		
		
	}
	//2011/04/08 change KUBO 確認メッセージのタイミング変更
	//------------前処理 --------------------------	
	//削除ボタン
	if (shori_shubetu=='2'  ){
		if ( !confirm("請求書を削除します。よろしいですか？") ) { return; }
	}

	//SkNo_ShubetsuCd : 請求書NO_請求書種別	
	SkNo_st= SkNo_ShubetsuCd.indexOf("_",0);  
	SkNo = SkNo_ShubetsuCd.substring(0, SkNo_st);//請求書NO
	SkShubetsuCd = SkNo_ShubetsuCd.substring(SkNo_st+1, SkNo_ShubetsuCd.length); //請求書種別
	
	//内容確認画面起動時
	if ( shori_shubetu=='5' ){
	     if (SkShubetsuCd=="9"){ //合計請求書の場合
	         name = "Un1050";
	     }
	}
	
	//6:印刷
	if ( shori_shubetu=='6' || shori_shubetu=='8' ){
		if (sPrintYmd !=""){
			if ( !confirm("請求書は印刷済みです。再印刷しますか？") ) { return; }
		}
	}
	
	param.func.value = "function." + name;
    param.view.value = "view." + name;    
    param.shori_shubetu.value = shori_shubetu;
    
    
	//------------処理種別固有のパラメータ設定----------------
	//削除ボタン
	if (shori_shubetu=='2'  ){
		param.SkMTable_Cnt.value = ChkNo;　//チェックの数
		param.target=''; //同一画面
    }
    //内容確認ボタン
    //5:内容確認 
    if (shori_shubetu=='5'  ){
    	//入金済み
		if (NyukinFlg!=""){
		    sSTATUS="4"; //入金済み  
		}
		//2011/06/17 add KUBO  支払作成済みは削除できない。  (　1:親無しの単票 2:親の単票 3:子の単票 4:入金済 5:支払作成済)
		if (sSTATUS!="4" && sSTATUS!="3"){
			if (ShihraiNo!=""){
				sSTATUS="5"; //支払作成済
			}
		}
		param.SEIKYUNO.value = SkNo;  	//  請求書NO
		param.target='blank'; 			//別画面
		param.STATUS.value = sSTATUS; 　 //内容確認ボタンからの起動　1:親無しの単票 2:親の単票 3:子の単票
    }
    // 1:受注内訳表示
    if (shori_shubetu=='1' ){
		param.SkMTable_Cnt.value = ChkNo;　//チェックの数
		//param.SEIKYUNO.value = SkNo_ShubetsuCd;　			//請求書NO_請求書種別	(単一選択の場合)
		param.denpyou_syurui_mei.value = 101;   //請求書種別:単票請求書  とりあえずセット
		param.target='blank'; //別画面
    }
    //印刷ボタン
	if (shori_shubetu=='6' || shori_shubetu=='8' ){
		param.SkMTable_Cnt.value = ChkNo;　//チェックの数
		param.SEIKYUNO.value = SkNo_ShubetsuCd;　			//請求書NO_請求書種別	(単一選択の場合)
		if(shori_shubetu=='8'){
			param.denpyou_syurui_mei.value = 104;   //請求書種別:単票請求書  とりあえずセット zip形式での出力
			param.target=''; //別画面
		}else{
			param.denpyou_syurui_mei.value = 101;   //請求書種別:単票請求書  とりあえずセット
			param.target='blank'; //別画面
		}
		//param.target='blank'; //別画面
		//2011/04/12 add KUBO START ---------------
		//2012/01/31 change KUBO
		if(document.RESULT.SkCheck.length) {
			param.SkMPrt_Cnt.value = document.RESULT.SkCheck.length;     //一覧の件数
		}else{
			param.SkMPrt_Cnt.value = 1;     //一覧の件数
		}
		//2011/04/12 add KUBO END ---------------
		
    }
    
    //合計請求書作成ボタン
	if (shori_shubetu=='7'  ){
		param.SeikyuTokuiCd.value = TokuiSakiCd;
		param.SkMTable_Cnt.value = ChkNo;　//チェックの数
		param.target='blank'; //別画面
    }
    
		
	param.submit();
}




// 「削除」クリック
//syori_syubetu
//2:削除
function update(param, syori_syubetu, name) {
	
	
	jump(param, syori_syubetu, SeikyuNo, false, name);
}
//2011/08/02 add KUBO
// 全選択・全解除
function allCheck(param, bool) {
	var i;
	with(document.RESULT) {
		if(param.length) {
			for(i = 0; i < param.length; i++) {
				param[i].checked = bool;
			}
		} else {
			param.checked = bool;
		}
	}
}
//日付変換
function HidukeHenkan(sDate) {

	var searchIndex = 0;	
	var strYYYY = "";    var strMM = "";    var strDD = "";var strYYYY_Hid = "";
	var strDay = "";
	searchIndex = cmnTrim(sDate).search("/");	
	strYYYY = cmnTrim(sDate).substring(0, searchIndex);
	strDay = cmnTrim(sDate).substring(searchIndex+1,cmnTrim(sDate).length);
	searchIndex = cmnTrim(strDay).search("/");	
	strMM = cmnTrim(strDay).substring(0, searchIndex);
	strDD = cmnTrim(strDay).substring(searchIndex+1,cmnTrim(strDay).length);
	if (cmnTrim(strMM).length==1){strMM ="0" + strMM;}
	if (cmnTrim(strDD).length==1){strDD ="0" + strDD;}
		
	
    return cmnTrim(strYYYY + strMM + strDD);

}
