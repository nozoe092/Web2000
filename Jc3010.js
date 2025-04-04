function syori(syubetu) {
	fm = document.result;
	fm.func.value = document.result.sub_func.value; //add by yufu 2002/05/15
	fm.view.value = document.result.sub_view.value; //add by yufu 2002/05/15
	fm.syori_syubetu.value = syubetu;
	
	const FAX_KBN_CODE_TSUSHIN = "3";
	const FAX_KBN_CODE_TSUSHIN_SHIKYU = "4";
	const HASISO_GYOSYA_SAGAWA = "06";
	const DENPYO_SYURUI_PDF_HEIMEN_SAGAWA = "55";
	const DENPYO_SYURUI_NOSHITSUKI_HEIMEN_SAGAWA = "56";
	const DENPYO_SYURUI_DAIBIKI_SAGAWA = "57";
	const DENPYO_NO_ZERO = "0";
	const DENPYO_NO_ICHI = "1";
	const DENPYO_NO_BLANK = "";
	
	var msg;
	var sagawaflg = false; //佐川急便対応用フラグ

	// 2012/10/12 add morimoto 請求書発行済み、または受注入力日が前月以前のためのdisableを解除
	SetDisable(false);

	if (syubetu == '1') {
		msg = '削除';
	} else if (syubetu == '2') {
		// 再出データの場合は事故責任区分を必須にする   add by yoshiyasu 2002/09/11
		if (document.result.saisyutu_kaisu.value != '0') {
			var jiko_flg = 0;
			for (i = 0; i < document.result.sekinin_kubun.length; i++) {
				if (document.result.sekinin_kubun[i].checked) {
					jiko_flg = 1;
					break;
				}
			}
			if (jiko_flg == 0) { alert("事故責任区分を選択してください。"); return; }
		}
		// 商品コードを変更した場合は、検索ボタンを押さないと登録不可にする add by yoshiyasu 2002/01/08
		if (fm.syohin_sel_flg.value == "0") { alert("商品を検索してください。"); return; }
		// 2012/10/12 add morimoto 請求書発行済み、または受注入力日が前月以前のためのdisableをセット
		// if ( ! check_Jc3010(syubetu) ) { return; }
		if (!check_Jc3010(syubetu)) { SetDisable(true); return; }
		msg = '登録';
		// 同包がある受注の場合、備考印字を更新するか確認する   add by yoshiyasu 2003/10/08
		if (fm.douhou.type == 'checkbox' && fm.douhou.checked) {
			if (confirm('同包の他の受注も備考（伝票印字）欄を更新しますか？')) { fm.douhou_bikou.value = '1'; }
			else { fm.douhou_bikou.value = '0'; }
		}
		// 同一申込番号の受注が他にもあり、かつ担当者コードを変更している場合	add 2005/04/06
		if (fm.tanto_code.value != fm.bef_tanto_code.value && eval(fm.JuchuCnt.value) > 1) {
			if (confirm('同一申込番号の他の受注も担当者を更新しますか？')) { fm.OtherTantoFlg.value = '1'; }
			else { fm.OtherTantoFlg.value = '0'; }
		}

		// 2006.09.26 表題に「不要」と指定して「のし印字フラグ」にチェックをつけた場合 kawahara
		if (fm.noshi_hyodai_code.options[fm.noshi_hyodai_code.selectedIndex].value == 'Y' && fm.noshi_print_flag.checked) {
			alert("のし「不要」が選択され、「のしを印字する」が選択されてます。");

			return;
		}
		
		//佐川急便対応
		var denpyoNo = fm.denpyo_no.value;
		denpyoNo = denpyoNo != null ? denpyoNo.trim() : DENPYO_NO_BLANK;
		if(isFinite(denpyoNo)){
			var denpyosyuruiname = fm.denpyo_syurui_nm.value;
			var faxCubunCode = fm.fax_kubun_code.value;
			var haisouGyosya = fm.haisou_gyosya.value;
			var DenpyoSyurui = denpyosyuruiname.substr(0,denpyosyuruiname.indexOf(':'));
			var haisouGyosyaValue = ""
			if(haisouGyosya != null){
				haisouGyosyaValue = haisouGyosya.substr(0,haisouGyosya.indexOf(':'));
			}
		
			if((FAX_KBN_CODE_TSUSHIN == faxCubunCode || FAX_KBN_CODE_TSUSHIN_SHIKYU == faxCubunCode) && 
          		HASISO_GYOSYA_SAGAWA == haisouGyosyaValue &&
          	(DENPYO_SYURUI_PDF_HEIMEN_SAGAWA == DenpyoSyurui || DENPYO_SYURUI_NOSHITSUKI_HEIMEN_SAGAWA == DenpyoSyurui) &&
          	(DENPYO_NO_ICHI != denpyoNo && DENPYO_NO_ZERO != denpyoNo && DENPYO_NO_BLANK != denpyoNo)) {
            	var rangeS = 510306100000; //伝票No範囲開始値
            	var rangeE = 510306599999; //伝票No範囲終了値
            	var rangeS1 = 350200000000; //伝票No範囲開始値
            	var rangeE1 = 350201499999; //伝票No範囲終了値

            	//範囲外true
				if(denpyoNo < rangeS1){
					sagawaflg = true;
				}
				else if(denpyoNo > rangeE1 && denpyoNo < rangeS){
					sagawaflg = true;
				}
				else if(denpyoNo > rangeE){
					sagawaflg = true;
				}
			}
		
			if((FAX_KBN_CODE_TSUSHIN == faxCubunCode || FAX_KBN_CODE_TSUSHIN_SHIKYU == faxCubunCode) &&
          	HASISO_GYOSYA_SAGAWA == haisouGyosyaValue &&
          	DENPYO_SYURUI_DAIBIKI_SAGAWA == DenpyoSyurui &&
          	(DENPYO_NO_ICHI != denpyoNo && DENPYO_NO_ZERO != denpyoNo && DENPYO_NO_BLANK != denpyoNo)) {
				var rangeS2 = 566054400000; //伝票No範囲開始値
            	var rangeE2 = 566055399999; //伝票No範囲終了値
			
				//範囲外true
				if(denpyoNo < rangeS2 || denpyoNo > rangeE2){
					sagawaflg = true;
				}
			}
		}
		
	} else if (syubetu == '3') {
		// 再出データの場合は事故責任区分を必須にする   add by yoshiyasu 2002/09/11
		var jiko_flg = 0;
		for (i = 0; i < document.result.sekinin_kubun.length; i++) {
			if (document.result.sekinin_kubun[i].checked) {
				jiko_flg = 1;
				break;
			}
		}
		if (jiko_flg == 0) { alert("事故責任区分を選択してください。"); return; }

		// 商品コードを変更した場合は、検索ボタンを押さないと再出（登録）不可にする add by yoshiyasu 2002/01/08
		if (fm.syohin_sel_flg.value == "0") { alert("商品を検索してください。"); return; }

		// 2006.09.26 表題に「不要」と指定して「のし印字フラグ」にチェックをつけた場合 kawahara
		if (fm.noshi_hyodai_code.options[fm.noshi_hyodai_code.selectedIndex].value == 'Y' && fm.noshi_print_flag.checked) {
			alert("のし「不要」が選択され、「のしを印字する」が選択されてます。");

			return;
		}

		// modified by shibata 2001/05/29
		// 2012/10/12 add morimoto 請求書発行済み、または受注入力日が前月以前のためのdisableをセット
		// if ( ! check_Jc3010(syubetu) ) { return; }
		if (!check_Jc3010(syubetu)) { SetDisable(true); return; }
		msg = '再出';
	} else if (syubetu == '4') {
		// 商品コードを変更した場合は、検索ボタンを押さないと再出（登録）不可にする add by yoshiyasu 2002/01/08
		if (fm.syohin_sel_flg.value == "0") { alert("商品を検索してください。"); return; }
		// modified by shibata 2001/05/29
		// 2012/10/12 add morimoto 請求書発行済み、または受注入力日が前月以前のためのdisableをセット
		// if ( ! check_Jc3010(syubetu) ) { return; }
		if (!check_Jc3010(syubetu)) { SetDisable(true); return; }
		msg = 'キャンセル';

	}

	//佐川急便対応
	if(sagawaflg){
		if(!confirm("使用できる佐川急便の配送伝票番号の範囲が異なります。\n配送伝票の印刷を行っても配送伝票は使用する事は出来ませんのでご注意ください。\n登録してもよろしいですか？")){
			SetDisable(true);
			return;
		}
	}

	// 2012/10/12 morimoto 請求書発行済み、または受注入力日が前月以前のためのdisableを設定
	//if ( ! confirm(msg + 'してもよろしいですか？') ) { return; }
	if(!sagawaflg){
		if (!confirm(msg + 'してもよろしいですか？')) { SetDisable(true); return; }
	}

	// 本人
	if (fm.otodoke_kubun_code[1].checked) {

		//2014/10/24 add KUBO --------------------------
		//【ご本人届けのお届け先が変更されております。変更の場合にはご本人届けのチェックを通常に変更して登録をお願いいたします。】
		//これでOKボタンを押すと元の画面に切り替わる
		if ((fm.todokesaki_yubin.value != fm.hid_odokesaki_yubin.value)
			|| (fm.todokesaki_tel.value != fm.hid_todokesaki_tel.value)
			|| (fm.todokesaki_address_1.value != fm.hid_todokesaki_address_1.value)
			|| (fm.todokesaki_address_2.value != fm.hid_todokesaki_address_2.value)
			|| (fm.todokesaki_name_1.value != fm.hid_todokesaki_name_1.value)
			|| (fm.todokesaki_name_2.value != fm.hid_todokesaki_name_2.value)
			|| (fm.todokesaki_name_3.value != fm.hid_todokesaki_name_3.value)) {

			alert("ご本人届けのお届け先が変更されております。変更の場合にはご本人届けのチェックを通常に変更して登録をお願いいたします。");

			fm.todokesaki_yubin.value = fm.hid_odokesaki_yubin.value;
			fm.todokesaki_tel.value = fm.hid_todokesaki_tel.value;
			fm.todokesaki_address_1.value = fm.hid_todokesaki_address_1.value;
			fm.todokesaki_address_2.value = fm.hid_todokesaki_address_2.value;
			fm.todokesaki_name_1.value = fm.hid_todokesaki_name_1.value;
			fm.todokesaki_name_2.value = fm.hid_todokesaki_name_2.value;
			fm.todokesaki_name_3.value = fm.hid_todokesaki_name_3.value;

			fm.todokesaki_yubin.focus();
			return false;
		}
		//2014/10/24 add KUBO --------------------------

		fm.todokesaki_yubin.value = fm.irai_yubin.value;
		fm.todokesaki_tel.value = fm.irai_tel.value;
		fm.todokesaki_address_1.value = fm.irai_address_1.value;
		fm.todokesaki_address_2.value = fm.irai_address_2.value;
		fm.todokesaki_name_1.value = fm.irai_name_1.value;
		fm.todokesaki_name_2.value = fm.irai_name_2.value;
		fm.todokesaki_name_3.value = fm.irai_name_3.value;

	}
	// 持帰り
	if (fm.otodoke_kubun_code[2].checked) {
		fm.todokesaki_yubin.value = "";
		fm.todokesaki_tel.value = "";
		fm.todokesaki_address_1.value = "";
		fm.todokesaki_address_2.value = "";
		fm.todokesaki_name_1.value = "";
		fm.todokesaki_name_2.value = "";
		fm.todokesaki_name_3.value = "";
		if (fm.cmbTIIKI.type != 'hidden') {
			fm.cmbTIIKI.selectedIndex = 0;
		}
	}

	//2014/05/01 add KUBO START----------------------------
	var kakuteiCancel = "";
	if (fm.kakuteiShohinCancel) {
		kakuteiCancel = fm.kakuteiShohinCancel.value;
	}
	if (kakuteiCancel == '1') {
		fm.syori_syubetu.value = '6';   //確定ｷｬﾝｾﾙコピーの新規登録
	}
	//2014/05/01 add KUBO END  ----------------------------

	// 2007.07.26 kawahara ターゲットを空白にする
	fm.target = "";

	fm.submit();
}

//2014/05/01 add KUBO START----------------------------
//選べるギフト２品選択のｷｬﾝｾﾙ対応(１品のみキャンセルを行ない他の商品で再度確定する)
function CancelExec(syubetu) {

	fm = document.result;
	fm.target = "target";
	fm.func.value = document.result.sub_func.value; //add by yufu 2002/05/15
	fm.view.value = document.result.sub_view.value; //add by yufu 2002/05/15
	fm.syori_syubetu.value = syubetu;
	
	
	
	var msg;

	// 2012/10/12 add morimoto 請求書発行済み、または受注入力日が前月以前のためのdisableを解除
	SetDisable(false);


	if (syubetu == '5') {

		// 商品コードを変更した場合は、検索ボタンを押さないと再出（登録）不可にする add by yoshiyasu 2002/01/08
		if (fm.syohin_sel_flg.value == "0") { alert("商品を検索してください。"); return; }

		if (!check_Jc3010(syubetu)) { SetDisable(true); return; }
		msg = 'キャンセル';

	}

	if (!confirm(msg + 'してもよろしいですか？\n' + 'キャンセル後にキャンセル元画面を再表示しますので\n必ず変更後に登録して下さい。')) { SetDisable(true); return; }
	// 2007.07.26 kawahara ターゲットを空白にする
	fm.target = "";
	fm.submit();

}
//2014/05/01 add KUBO END  ----------------------------

function check_Jc3010(syubetu) {
	fm = document.result;
	var objvalue;


	/* 共通 */
	if (!cmnCheck(fm)) { return false; }

	var flgBbs = (fm.hidBBS_FLG.value == '1');                // BBSフラグ
	var flgDispMosikomi = (fm.txtMO_TELNO.type == 'text');  	// 申込者情報表示フラグ
	var flgDaiko = (fm.hidKAISHA_KB.value == "5");                // 入力専用フラグ
	var flgShokaiFlg_Haiso = (fm.ShokaiFlg_Haiso.value == '1');                // メーカー配送情報変更フラグ  //2012/06/01 add KUBO

	// 申込番号(サンリッチ編集用) add by shibata 2001/05/08
	//サンリッチ'0000'ユーザの場合のみ、テキストボックスが存在し、入力可能
	if (fm.order_no_edit != null) {
		if (fm.order_no_edit.value == '') { alert("申込番号:" + MSG_0002); if (!flgShokaiFlg_Haiso) { fm.order_no_edit.focus() }; return false; }
		if (!cmnCheckMaxLengthB(fm.order_no_edit.value, 16)) { alert("申込番号:" + MSG_0011); if (!flgShokaiFlg_Haiso) { fm.order_no_edit.focus() }; return false; }
		// 申込番号はスペースをとる add by yoshiyasu 2001/12/21
		fm.order_no_edit.value = cmnTrim(fm.order_no_edit.value);
	}
	// 行ＮＯと枝ＮＯもチェックする     add by yoshiyasu 2001/07/03
	if (fm.gyo_no_edit != null) {
		if (fm.gyo_no_edit.value == '') { alert("行ＮＯ:" + MSG_0002); if (!flgShokaiFlg_Haiso) { fm.gyo_no_edit.focus() }; return false; }
		if (!cmnCheckMaxLengthB(fm.gyo_no_edit.value, 2)) { alert("行ＮＯ:" + MSG_0011); if (!flgShokaiFlg_Haiso) { fm.gyo_no_edit.focus() }; return false; }
	}
	if (fm.eda_no_edit != null) {
		if (fm.eda_no_edit.value == '') { alert("枝ＮＯ" + MSG_0002); if (!flgShokaiFlg_Haiso) { fm.eda_no_edit.focus() }; return false; }
		if (!cmnCheckMaxLengthB(fm.eda_no_edit.value, 2)) { alert("枝ＮＯ" + MSG_0011); if (!flgShokaiFlg_Haiso) { fm.eda_no_edit.focus() }; return false; }
	}

	// 受注入力日 add by shibata 2001/05/08
	//サンリッチ'0000'ユーザの場合のみ、日付コンボが存在し、入力可能
	if (fm.jchu_y != null) {
		fm.juchu_input_date.value = fm.jchu_y.value + fm.jchu_m.value + fm.jchu_d.value;
		if (!cmnCheckDate(fm.juchu_input_date.value)) { alert("受注入力日:" + MSG_0004); if (!flgShokaiFlg_Haiso) { fm.jchu_y.focus() }; return false; }
	}
	// 承り日
	fm.uketamawaribi.value = fm.uke_y.value + fm.uke_m.value + fm.uke_d.value;
	if (!cmnCheckDate(fm.uketamawaribi.value)) { alert("承り日:" + MSG_0004); if (!flgShokaiFlg_Haiso) { fm.uke_y.focus() }; return false; }
	// 確定商品の場合、はがき返信日（キット返信日）をセットする
	if (fm.order_bunrui.value == '3') {
		fm.hagakihenshinbi.value = fm.henshin_y.value + fm.henshin_m.value + fm.henshin_d.value;
		if (!cmnCheckDate(fm.hagakihenshinbi.value)) { alert("はがき返信日(キット返信日):" + MSG_0004); if (!flgShokaiFlg_Haiso) { fm.henshin_y.focus() }; return false; }
	}

	//承り依頼者 add by shibata 2001/04/25
	if (!cmnCheckMaxLengthB(fm.uke_iraisha.value, 40)) { alert("承り区分(依頼者):" + MSG_0011); if (!flgShokaiFlg_Haiso) { fm.uke_iraisha.focus() }; return false; }

	// 依頼主郵便番号
	if (fm.irai_yubin.value != '') {
		if (!cmnCheckNum(fm.irai_yubin.value)) { alert("依頼主郵便番号:" + MSG_0001); if (!flgShokaiFlg_Haiso) { fm.irai_yubin.focus() }; return false; }
		if (!cmnCheckZenkaku(fm.irai_yubin.value)) { alert("依頼主郵便番号は" + MSG_0014); if (!flgShokaiFlg_Haiso) { fm.irai_yubin.focus() }; return false; }
	}
	// 依頼主電話番号
	if (fm.irai_tel.value !== '') {
		if (!cmnCheckNum(fm.irai_tel.value)) { alert("依頼主電話番号:" + MSG_0001); if (!flgShokaiFlg_Haiso) { fm.irai_tel.focus() }; return false; }
		if (!cmnCheckZenkaku(fm.irai_tel.value)) { alert("依頼主電話番号は" + MSG_0014); if (!flgShokaiFlg_Haiso) { fm.irai_tel.focus() }; return false; }
	}
	// 依頼主住所１
	if (!cmnCheckMaxLengthB(fm.irai_address_1.value, 68)) { alert("依頼主住所１:" + MSG_0011); if (!flgShokaiFlg_Haiso) { fm.irai_address_1.focus() }; return false; }
	// 依頼主住所２
	if (!cmnCheckMaxLengthB(fm.irai_address_2.value, 50)) { alert("依頼主住所２" + MSG_0011); if (!flgShokaiFlg_Haiso) { fm.irai_address_2.focus() }; return false; }
	// 依頼主氏名１
	if (!cmnCheckMaxLengthB(fm.irai_name_1.value, 50)) { alert("依頼主氏名１" + MSG_0011); if (!flgShokaiFlg_Haiso) { fm.irai_name_1.focus() }; return false; }
	// 依頼主氏名２
	if (!cmnCheckMaxLengthB(fm.irai_name_2.value, 50)) { alert("依頼主氏名２" + MSG_0011); if (!flgShokaiFlg_Haiso) { fm.irai_name_2.focus() }; return false; }
	// 依頼主氏名３
	if (!cmnCheckMaxLengthB(fm.irai_name_3.value, 52)) { alert("依頼主氏名３" + MSG_0011); if (!flgShokaiFlg_Haiso) { fm.irai_name_3.focus() }; return false; }
	if (flgDispMosikomi) {
		// 申込者情報を表示している場合
		if (flgBbs) {
			// BBSの場合
			if (fm.txtMO_TELNO.value == '') { alert("電話番号は" + MSG_0002); if (!flgShokaiFlg_Haiso) { fm.txtMO_TELNO.focus() }; return false; } // MSG
			if (cmnLengthB(fm.txtMO_KYAKUNO.value) != 6) { alert("お客様番号は６桁で入力してください。"); if (!flgShokaiFlg_Haiso) { fm.txtMO_KYAKUNO.focus() }; return false; }
		}
		// お客様番号全角チェック
		if (!cmnCheckZenkaku(fm.txtMO_KYAKUNO.value)) { alert("お客様番号は" + MSG_0014); if (!flgShokaiFlg_Haiso) { fm.txtMO_KYAKUNO.focus() }; return false; } // MSG
		// 郵便番号全角チェック
		if (!cmnCheckZenkaku(fm.txtMO_YUBINNO.value)) { alert("郵便番号は" + MSG_0014); if (!flgShokaiFlg_Haiso) { fm.txtMO_YUBINNO.focus() }; return false; } // MSG
		// 電話番号全角チェック
		if (!cmnCheckZenkaku(fm.txtMO_TELNO.value)) { alert("電話番号は" + MSG_0014); if (!flgShokaiFlg_Haiso) { fm.txtMO_TELNO.focus() }; return false; } // MSG
		// 長さチェック
		if (!cmnCheckMaxLengthB(fm.txtMO_ADDR1.value, 50)) { alert("申込者住所１:" + MSG_0011); if (!flgShokaiFlg_Haiso) { fm.txtMO_ADDR1.focus() }; return false; }
		if (!cmnCheckMaxLengthB(fm.txtMO_ADDR2.value, 50)) { alert("申込者住所２:" + MSG_0011); if (!flgShokaiFlg_Haiso) { fm.txtMO_ADDR2.focus() }; return false; }
		if (!cmnCheckMaxLengthB(fm.txtMO_NM1.value, 40)) { alert("申込者氏名１:" + MSG_0011); if (!flgShokaiFlg_Haiso) { fm.txtMO_NM1.focus() }; return false; }
		if (!cmnCheckMaxLengthB(fm.txtMO_NM2.value, 40)) { alert("申込者氏名２:" + MSG_0011); if (!flgShokaiFlg_Haiso) { fm.txtMO_NM2.focus() }; return false; }
		if (!cmnCheckMaxLengthB(fm.txtMO_NM3.value, 40)) { alert("申込者氏名３:" + MSG_0011); if (!flgShokaiFlg_Haiso) { fm.txtMO_NM3.focus() }; return false; }
	} else {
		// 依頼主お客様番号
		if (!cmnCheckMaxLengthB(fm.irai_no.value, 20)) { alert("依頼主お客様番号:" + MSG_0011); if (!flgShokaiFlg_Haiso) { fm.irai_no.focus() }; return false; }
	}
	// 入力専用の場合は、支払情報をチェックしない	2004/05/12
	if (flgDaiko) {
		// 代引き手数料
		if (fm.daihiki.value == '') { alert("代引き手数料:" + MSG_0002); if (!flgShokaiFlg_Haiso) { fm.daihiki.focus() }; return false; }
		if (isNaN(fm.daihiki.value)) { alert("代引き手数料:" + MSG_0008); if (!flgShokaiFlg_Haiso) { fm.daihiki.focus() }; return false; }
	} else {
		if (flgBbs) {
			var select_flg = 0;
			for (count = 0; count < fm.shiharai_houhou.length; count++) {
				if (fm.shiharai_houhou[count].checked == true) {
					select_flg = 1;
					break;
				}
			}
			if (select_flg == 0) { alert('支払方法は' + MSG_0002); return false; }
		} else {
			// 2012/09/10 hoshihara start 代引き整合性チェック
			// 伝票種類を取得
			var denpyo_syurui = fm.denpyo_syurui_nm.value.substr(0, 2);

			// 支払回数 add by yoshiyasu 2001/11/16
			if (!cmnCheckMaxLengthB(fm.shiharai_kaisu.value, 10)) { alert("支払回数:" + MSG_0011); if (!flgShokaiFlg_Haiso) { fm.shiharai_kaisu.focus() }; return false; }
			// 有効期限 add by yoshiyasu 2001/11/16
			objvalue = fm.yuukou_kigen.value;
			if (cmnTrim(objvalue) != "") {
				var e_yuukou = RemoveString(objvalue, "/");
				if (!cmnCheckHankakuEisu(e_yuukou)) { alert("有効期限は" + MSG_0014); if (!flgShokaiFlg_Haiso) { fm.yuukou_kigen.focus() }; return false; }
				if (cmnLengthB(e_yuukou) != 4) { alert("有効期限:" + MSG_0004); if (!flgShokaiFlg_Haiso) { fm.yuukou_kigen.focus() }; return false; }
			}
			// 代引き手数料 add by yoshiyasu 2002/04/16
			if (fm.daihiki.value == '') { alert("代引き手数料:" + MSG_0002); if (!flgShokaiFlg_Haiso) { fm.daihiki.focus() }; return false; }
			if (isNaN(fm.daihiki.value)) { alert("代引き手数料:" + MSG_0008); if (!flgShokaiFlg_Haiso) { fm.daihiki.focus() }; return false; }
		}
		// 支払備考 add by yoshiyasu 2001/11/16
		if (!cmnCheckMaxLengthB(fm.shiharai_bikou.value, 65)) { alert("支払備考:" + MSG_0011); if (!flgShokaiFlg_Haiso) { fm.shiharai_bikou.focus() }; return false; }
	}
	// 届け先番号のチェックを追加     2002/12/19 yoshiyasu
	if (fm.order_bunrui.value == '4') {    // 通販の場合チェックする
		var todoke_no = fm.todokesaki_no;
		if (todoke_no.value == '') { alert("届け先番号は" + MSG_0002); if (!flgShokaiFlg_Haiso) { todoke_no.focus() }; return false; } // MSG
		if (isNaN(todoke_no.value)) { alert("届け先番号は" + MSG_0008); if (!flgShokaiFlg_Haiso) { todoke_no.focus() }; return; } // MSG
		if (eval(todoke_no.value) > 3 || eval(todoke_no.value) < 0) { alert("お届け先の番号が不正です"); if (!flgShokaiFlg_Haiso) { todoke_no.focus() }; return; } // MSG
		if (todoke_no.value == 0 && !fm.otodoke_kubun_code[1].checked) { alert("届け先番号が０の場合、ご本人届けにして下さい"); if (!flgShokaiFlg_Haiso) { todoke_no.focus() }; return; } // MSG
	}
	// 届け先郵便番号
	if (!cmnCheckNum(fm.todokesaki_yubin.value)) { alert("届け先郵便番号:" + MSG_0001); if (!flgShokaiFlg_Haiso) { fm.todokesaki_yubin.focus() }; return false; }
	if (!cmnCheckZenkaku(fm.todokesaki_yubin.value)) { alert("届け先郵便番号は" + MSG_0014); if (!flgShokaiFlg_Haiso) { fm.todokesaki_yubin.focus() }; return false; }
	// 届け先電話番号
	if (!cmnCheckNum(fm.todokesaki_tel.value)) { alert("届け先電話番号:" + MSG_0001); if (!flgShokaiFlg_Haiso) { fm.todokesaki_tel.focus() }; return false; }
	if (!cmnCheckZenkaku(fm.todokesaki_tel.value)) { alert("届け先電話番号は" + MSG_0014); if (!flgShokaiFlg_Haiso) { fm.todokesaki_tel.focus() }; return false; }
	// 届け先住所１
	if (!cmnCheckMaxLengthB(fm.todokesaki_address_1.value, 68)) { alert("届け先住所１:" + MSG_0011); if (!flgShokaiFlg_Haiso) { fm.todokesaki_address_1.focus() }; return false; }
	// 届け先住所２
	if (!cmnCheckMaxLengthB(fm.todokesaki_address_2.value, 50)) { alert("届け先住所２:" + MSG_0011); if (!flgShokaiFlg_Haiso) { fm.todokesaki_address_2.focus() }; return false; }
	// 届け先氏名１
	if (!cmnCheckMaxLengthB(fm.todokesaki_name_1.value, 50)) { alert("届け先氏名１:" + MSG_0011); if (!flgShokaiFlg_Haiso) { fm.todokesaki_name_1.focus() }; return false; }
	// 届け先氏名２
	if (!cmnCheckMaxLengthB(fm.todokesaki_name_2.value, 50)) { alert("届け先氏名２:" + MSG_0011); if (!flgShokaiFlg_Haiso) { fm.todokesaki_name_2.focus() }; return false; }
	// 届け先氏名３
	if (!cmnCheckMaxLengthB(fm.todokesaki_name_3.value, 52)) { alert("届け先氏名３:" + MSG_0011); if (!flgShokaiFlg_Haiso) { fm.todokesaki_name_3.focus() }; return false; }
	// 最大文字数チェック		add by yoshiyasu 2004/04/06
	var denpyoKb = fm.fax_kubun_code[fm.fax_kubun_code.selectedIndex].value;
	var isCheckMaxMoji = (denpyoKb == '3' || denpyoKb == '4');
	var faxHachuFlg = fm.hidFAX_HACHU_FLG.value;
	if (isCheckMaxMoji && faxHachuFlg != '1') {
		var denpyoShu = fm.denpyo_syurui_nm.options[fm.denpyo_syurui_nm.selectedIndex].value;
		var denpyoShuCd = denpyoShu.substring(0, 2);
		var maxMoji = fm.elements['hidDENPYO_LIST' + denpyoShuCd].value;
		var maxMojiArray = maxMoji.split(",");
		if (!checkMaxMoji(fm.irai_address_1.value, maxMojiArray[0], "依頼主住所１")) { if (!flgShokaiFlg_Haiso) { fm.irai_address_1.focus() }; return false; }
		if (!checkMaxMoji(fm.irai_address_2.value, maxMojiArray[1], "依頼主住所２")) { if (!flgShokaiFlg_Haiso) { fm.irai_address_2.focus() }; return false; }
		if (!checkMaxMoji(fm.irai_address_1.value + fm.irai_address_2.value, maxMojiArray[2], "依頼主住所１＋２")) { if (!flgShokaiFlg_Haiso) { fm.irai_address_1.focus() }; return false; }
		if (!checkMaxMoji(fm.irai_name_1.value, maxMojiArray[3], "依頼主氏名１")) { if (!flgShokaiFlg_Haiso) { fm.irai_name_1.focus() }; return false; }
		if (!checkMaxMoji(fm.irai_name_2.value, maxMojiArray[4], "依頼主氏名２")) { if (!flgShokaiFlg_Haiso) { fm.irai_name_2.focus() }; return false; }
		if (!checkMaxMoji(fm.irai_name_3.value, maxMojiArray[5], "依頼主氏名３")) { if (!flgShokaiFlg_Haiso) { fm.irai_name_3.focus() }; return false; }
		if (!checkMaxMoji(fm.irai_name_1.value + fm.irai_name_2.value, maxMojiArray[6], "依頼主氏名１＋２")) { if (!flgShokaiFlg_Haiso) { fm.irai_name_1.focus() }; return false; }
		if (!checkMaxMoji(fm.todokesaki_address_1.value, maxMojiArray[7], "届け先住所１")) { if (!flgShokaiFlg_Haiso) { fm.todokesaki_address_1.focus() }; return false; }
		if (!checkMaxMoji(fm.todokesaki_address_2.value, maxMojiArray[8], "届け先住所２")) { if (!flgShokaiFlg_Haiso) { fm.todokesaki_address_2.focus() }; return false; }
		if (!checkMaxMoji(fm.todokesaki_address_1.value + fm.todokesaki_address_2.value, maxMojiArray[9], "届け先住所１＋２")) { if (!flgShokaiFlg_Haiso) { fm.todokesaki_address_1.focus() }; return false; }
		if (!checkMaxMoji(fm.todokesaki_name_1.value, maxMojiArray[10], "届け先氏名１")) { if (!flgShokaiFlg_Haiso) { fm.todokesaki_name_1.focus() }; return false; }
		if (!checkMaxMoji(fm.todokesaki_name_2.value, maxMojiArray[11], "届け先氏名２")) { if (!flgShokaiFlg_Haiso) { fm.todokesaki_name_2.focus() }; return false; }
		if (!checkMaxMoji(fm.todokesaki_name_3.value, maxMojiArray[12], "届け先氏名３")) { if (!flgShokaiFlg_Haiso) { fm.todokesaki_name_3.focus() }; return false; }
		if (!checkMaxMoji(fm.todokesaki_name_1.value + fm.todokesaki_name_2.value, maxMojiArray[13], "届け先氏名１＋２")) { if (!flgShokaiFlg_Haiso) { fm.todokesaki_name_1.focus() }; return false; }
		if (!checkMaxMoji(fm.bikoup.value, maxMojiArray[14], "備考印字")) { if (!flgShokaiFlg_Haiso) { fm.bikoup.focus() }; return false; }
		if (!checkMaxMoji(fm.bikou_haiso.value, maxMojiArray[15], "配送備考")) { if (!flgShokaiFlg_Haiso) { fm.bikou_haiso.focus() }; return false; }
	}
	// 商品コード
	if (fm.syohin_code.value != fm.hidden_syohin_code.value) { alert("商品コード:" + MSG_0009); if (!flgShokaiFlg_Haiso) { fm.syohin_code.focus() }; return false; }
	// 一般
	//if ( fm.order_bunrui.value != '3' ) {     // del by yoshiyasu 2001/12/11
	if (fm.order_bunrui.value == '2') {
		if (fm.kit_kanri_no.value == '') { alert("管理Ｎｏ:" + MSG_0002); if (!flgShokaiFlg_Haiso) { fm.kit_kanri_no.focus() }; return false; }
		if (!cmnCheckZenkaku(fm.kit_kanri_no.value)) { alert("管理Ｎｏは" + MSG_0014); if (!flgShokaiFlg_Haiso) { fm.kit_kanri_no.focus() }; return false; }
	}

	if (fm.otodoke_kubun_code[1].checked) {
		// 本人
		if (fm.todokesaki_address_1.value + fm.todokesaki_address_2.value == '') { alert("届け先住所:" + MSG_0002); if (!flgShokaiFlg_Haiso) { fm.todokesaki_address_1.focus() }; return false; }
		if (fm.todokesaki_name_1.value + fm.todokesaki_name_2.value + fm.todokesaki_name_3.value == '') { alert("届け先氏名:" + MSG_0002); if (!flgShokaiFlg_Haiso) { fm.todokesaki_name_1.focus() }; return false; }
	}
	// 持ち帰り以外の場合、地区をチェックする	2004/02/24 yoshiyasu
	if (!fm.otodoke_kubun_code[2].checked) {
		if (fm.cmbTIIKI.type != 'hidden') {
			if (fm.cmbTIIKI.selectedIndex == 0) { alert('地区を選択して下さい。'); if (!flgShokaiFlg_Haiso) { fm.cmbTIIKI.focus() }; return false; }
		}
	}

	// ↓2012/10/25 キャンセルボタン押下時のエラー発生対応 morimoto
	// 2007.04.02 kawahara チョイス(コース)とチョイス(商品)の場合も一般にチェックをいれる
	if (fm.order_bunrui.value != '4') {
		if (fm.syohin_syubetu.value == '1' || fm.syohin_syubetu.value == '5' || fm.syohin_syubetu.value == '6') {
			fm.jyutyu_kubun[0].checked = true;
		} else if (fm.syohin_syubetu.value != '4') {
			fm.jyutyu_kubun[1].checked = true;
		}
	}
	if (fm.jyutyu_kubun_irregular.checked) {
		// 販売価格
		if (isNaN(fm.kakaku_hanbai.value)) { alert("販売価格:" + MSG_0008); if (!flgShokaiFlg_Haiso) { fm.kakaku_hanbai.focus() }; return false; }
		// 入力専用の場合は、仕入価格をチェックしない 2004/05/12
		if (!flgDaiko) {
			// 仕入価格
			if (isNaN(fm.kakaku_shiire.value)) { alert("仕入価格:" + MSG_0008); if (!flgShokaiFlg_Haiso) { fm.kakaku_shiire.focus() }; return false; }
		}
	} else {
		fm.kakaku_hanbai.value = fm.hidden_kakaku_hanbai.value;
		// 入力専用の場合は、仕入価格をチェックしない 2004/05/12
		if (!flgDaiko) {
			fm.kakaku_shiire.value = fm.hidden_kakaku_shiire.value;
		}
	}
	
	// Skログインエラー回数チェック 
	if(fm.loginError_kaisu_flg.value == "1"){
		if (fm.input_loginError_kaisu.value === "") { fm.input_loginError_kaisu.value = "0"; }
		else if (/[^\d+$]/.test(fm.input_loginError_kaisu.value)) { alert("SKログインエラー回数:" + MSG_0008); if (!flgShokaiFlg_Haiso) { fm.input_loginError_kaisu.focus() }; return false; }
	}
	
	// 最大同包個数
	fm.syohin_num_max.value = fm.hidden_syohin_max.value;
	// 数量
	// 必須入力チェック add 2001/07/03
	if (fm.syohin_num.value == '') { alert("数量:" + MSG_0002); if (!flgShokaiFlg_Haiso) { fm.syohin_num.focus() }; return false; }
	if (isNaN(fm.syohin_num.value)) { alert("数量:" + MSG_0008); if (!flgShokaiFlg_Haiso) { fm.syohin_num.focus() }; return false; }
	if (eval(fm.syohin_num.value) > eval(fm.syohin_num_max.value)) { alert("数量:" + MSG_2001); if (!flgShokaiFlg_Haiso) { fm.syohin_num.focus() }; return false; }

	// 送料
	// 必須入力チェック add 2001/07/03
	if (fm.unchin_uriage.value == '') { alert("送料(受入):" + MSG_0002); if (!flgShokaiFlg_Haiso) { fm.unchin_uriage.focus() }; return false; }
	if (fm.unchin_shiharai.value == '') { alert("送料(支払):" + MSG_0002); if (!flgShokaiFlg_Haiso) { fm.unchin_shiharai.focus() }; return false; }
	// 売上運賃
	if (isNaN(fm.unchin_uriage.value)) { alert("売上運賃:" + MSG_0008); if (!flgShokaiFlg_Haiso) { fm.unchin_uriage.focus() }; return false; }
	// 支払運賃
	if (isNaN(fm.unchin_shiharai.value)) { alert("支払運賃:" + MSG_0008); if (!flgShokaiFlg_Haiso) { fm.unchin_shiharai.focus() }; return false; }

	// のし表題
	if (fm.noshi_hyodai_code.selectedIndex == (fm.noshi_hyodai_code.options.length - 1)) {
		if (!cmnCheckMaxLengthB(fm.noshi_hyodai_name.value, 20)) { alert("のし表題:" + MSG_0011); if (!flgShokaiFlg_Haiso) { fm.noshi_hyodai_name.focus() }; return false; }
	}
	// のし名入
	//if ( fm.noshi_naire_code.selectedIndex == (fm.noshi_naire_code.options.length - 1) ) {
	if (!cmnCheckMaxLengthB(fm.noshi_naire_name.value, 152)) { alert("のし名入:" + MSG_0011); if (!flgShokaiFlg_Haiso) { fm.noshi_naire_name.focus() }; return false; }
	//}
	// 包装位置 add by shibata 2001/05/28
	if (fm.hoso_noshi_code.selectedIndex == (fm.hoso_noshi_code.options.length - 1)) {
		if (!cmnCheckMaxLengthB(fm.hoso_noshi_name.value, 20)) { alert("包装のし名称:" + MSG_0011); if (!flgShokaiFlg_Haiso) { fm.hoso_noshi_name.focus() }; return false; }
	}
	// 包装方法
	if (fm.hoso_houhou_code.selectedIndex == (fm.hoso_houhou_code.options.length - 1)) {
		if (!cmnCheckMaxLengthB(fm.hoso_houhou_name.value, 20)) { alert("包装方法:" + MSG_0011); if (!flgShokaiFlg_Haiso) { fm.hoso_houhou_name.focus() }; return false; }
	}

	//}
	// 受注入力日が出荷可能期間終了日を超えていないかチェックする   2003/11/05 yoshiyasu
	if ((fm.hidden_juchu_input_date_org.value != "99990101") && (fm.hidden_juchu_input_date_org.value != fm.today.value)) {
		if (cmnCheckKikanEnd_Confirm(fm.juchu_input_date.value, fm.syukka_kikan_e.value) == false) { return false; }
	} else if (fm.chkReserve.checked == false) {
		if (cmnCheckKikanEnd_Confirm(fm.today.value, fm.syukka_kikan_e.value) == false) { return false; }
	}
	// 着日
	if (fm.shitei_tyakubi.value != "") {
		//if ( ! cmnCheckDate(fm.shitei_tyakubi.value) ) { alert("着日指定:" + MSG_0004); if (!flgShokaiFlg_Haiso){fm.shitei_tyakubi.focus()}; return false; }
		if (cmnCheckChakubi(fm.shitei_tyakubi, fm.juchu_input_date.value, fm.syukka_kikan_s.value, fm.syukka_kikan_e.value) == false) { return false; }
	}


	//// 2006.12.06 kawahara
	var jchuday = "";
	if (fm.jchu_y != null) {
		jchuday = fm.jchu_y.value + fm.jchu_m.value + fm.jchu_d.value;
	} else {
		jchuday = fm.juchu_input_date.value;
	}

	if (jchuday > fm.today.value) {
		// 受注入力日が未来の場合

		if (fm.shitei_tyakubi.value != "") {

			if (fm.hidden_tyakubi_org.value != fm.shitei_tyakubi.value) {
				// 着日が変更されてる場合

				if (confirm("受注入力日が明日以降の受注データです。\n  受注入力日 : " + jchuday.substr(0, 4) + "/"
					+ jchuday.substr(4, 2) + "/" + jchuday.substr(6, 2) + "\n  着日指定日 : "
					+ fm.shitei_tyakubi.value + "\nで登録しますか?")) {

				} else {
					return;
				}
			}
		}
	}

	// 出荷予定日
	if (fm.syukkayoteibi.value != "") {
		if (!cmnCheckDate(fm.syukkayoteibi.value)) { alert("出荷予定日:" + MSG_0004); if (!flgShokaiFlg_Haiso) { fm.syukkayoteibi.focus() }; return false; }
	}
	// 出荷予定日は着日指定日より未来の日付は不可   add by yoshiyasu 2002/01/15
	var chk_tyakubi = RemoveString(fm.shitei_tyakubi.value, "/");
	var chk_syukkabi = RemoveString(fm.syukkayoteibi.value, "/");
	if (chk_tyakubi != "" && chk_syukkabi > chk_tyakubi) {
		alert('出荷予定日は着日指定日以前の日付にして下さい。');
		if (!flgShokaiFlg_Haiso) { fm.syukkayoteibi.focus() };
		return false;
	}

	// 伝票印刷先
	if (fm.hidINSATUSAKI_FLG.value != '1') { alert('伝票印刷先を検索してください。'); if (!flgShokaiFlg_Haiso) { fm.insatu_code.focus() }; return false; }

	// 伝票番号
	if (!cmnCheckMaxLengthB(fm.denpyo_no.value, 20)) { alert("伝票Ｎｏ:" + MSG_0011); if (!flgShokaiFlg_Haiso) { fm.denpyo_no.focus() }; return false; }
	if (!cmnCheckZenkaku(fm.denpyo_no.value)) { alert("伝票Ｎｏは" + MSG_0014); if (!flgShokaiFlg_Haiso) { fm.denpyo_no.focus() }; return false; }
	//チェックOKなら'-'を除去する add by shibata 2001/05/31
	fm.denpyo_no.value = cmnRemoveHihun(fm.denpyo_no.value);
	// 出荷日
	if (fm.syukkabi.value != "") {
		if (!cmnCheckDate(fm.syukkabi.value)) { alert("出荷日:" + MSG_0004); if (!flgShokaiFlg_Haiso) { fm.syukkabi.focus() }; return false; }
	}
	// 配完日
	if (fm.haikanbi.value != "") {
		if (!cmnCheckDate(fm.haikanbi.value)) { alert("配完日:" + MSG_0004); if (!flgShokaiFlg_Haiso) { fm.haikanbi.focus() }; return false; }
	}
	// 事故発生日
	if (fm.jiko_date.value != "") {
		if (!cmnCheckDate(fm.jiko_date.value)) { alert("事故発生日:" + MSG_0004); if (!flgShokaiFlg_Haiso) { fm.jiko_date.focus() }; return false; }
	}

	if (!cmnCheckMaxLengthB(fm.chosa_string.value, 20)) { alert("調査状況:" + MSG_0011); if (!flgShokaiFlg_Haiso) { fm.chosa_string.focus() }; return false; }

	if (!cmnCheckMaxLengthB(fm.jiko_riyu.value, 20)) { alert("事故理由:" + MSG_0011); if (!flgShokaiFlg_Haiso) { fm.jiko_riyu.focus() }; return false; }

	// 管理番号Ａ，Ｂ，Ｃ追加   2001/11/21 yoshiyasu
	// 半角チェック追加     2001/12/06 yoshiyasu
	if (!cmnCheckZenkaku(fm.kanri_bangouA.value)) { alert("管理番号Aは" + MSG_0014); if (!flgShokaiFlg_Haiso) { fm.kanri_bangouA.focus() }; return false; }

	// 2007/10/15 kawahara 管理番号Aは、32バイトまで入力可能に変更
	if (!cmnCheckZenkaku(fm.kanri_bangouA.value)) { alert("管理番号A:" + MSG_0014); if (!flgShokaiFlg_Haiso) { fm.kanri_bangouA.focus() }; return false; }

	if (!cmnCheckZenkaku(fm.kanri_bangouB.value)) { alert("管理番号B:" + MSG_0014); if (!flgShokaiFlg_Haiso) { fm.kanri_bangouB.focus() }; return false; }

	// 2007/10/15 kawahara 管理番号Bは、32バイトまで入力可能に変更
	if (!cmnCheckMaxLengthB(fm.kanri_bangouB.value, 100)) { alert("管理番号B:" + MSG_0011); if (!flgShokaiFlg_Haiso) { fm.kanri_bangouB.focus() }; return false; }

	//if ( ! cmnCheckZenkaku(fm.kanri_bangouC.value) ) { alert(MSG_0014);fm.kanri_bangouC.focus();return false; }
	if (!cmnCheckZenkaku(fm.kanri_bangouC.value)) { alert("管理番号C:" + MSG_0014); if (!flgShokaiFlg_Haiso) { fm.kanri_bangouC.focus() }; return false; }

	//2015/04/06 管理番号Cは、32バイトまで入力可能に変更
	if (!cmnCheckMaxLengthB(fm.kanri_bangouC.value, 40)) { alert("管理番号C:" + MSG_0011); if (!flgShokaiFlg_Haiso) { fm.kanri_bangouC.focus() }; return false; }

	// 販売店配送伝票番号
	if (!cmnCheckZenkaku(fm.hanbai_denpyo_no.value)) { alert("得意先伝票Ｎｏは" + MSG_0014); if (!flgShokaiFlg_Haiso) { fm.hanbai_denpyo_no.focus() }; return false; }
	if (!cmnCheckMaxLengthB(fm.hanbai_denpyo_no.value, 32)) { alert("得意先伝票Ｎｏ:" + MSG_0011); if (!flgShokaiFlg_Haiso) { fm.hanbai_denpyo_no.focus() }; return false; }

	// サンリッチ仕入単価
	if (isNaN(fm.siire_tanka.value)) { alert("サンリッチ仕入単価:" + MSG_0008); if (!flgShokaiFlg_Haiso) { fm.siire_tanka.focus() }; return false; }
	if (!cmnCheckMaxLengthB(fm.siire_tanka.value, 7)) { alert("サンリッチ仕入単価:" + MSG_0011); if (!flgShokaiFlg_Haiso) { fm.siire_tanka.focus() }; return false; }
	// サンリッチ販売単価   add by yoshiyasu 2001/10/26
	if (isNaN(fm.hanbai_tanka.value)) { alert("サンリッチ販売単価:" + MSG_0008); if (!flgShokaiFlg_Haiso) { fm.hanbai_tanka.focus() }; return false; }

	// 同包のチェックを追加     2002/04/24 yoshiyasu
	if (fm.douhou.type == "checkbox" && fm.douhou.checked) {    // 同包の商品があって、チェックをはずしていない場合
		var haisou = fm.haisou_gyosya.value;
		var denpyo = fm.denpyo_syurui_nm.value;
		var haisou_code, denpyo_syurui;
		var point;
		// 配送業者コードの取得
		point = haisou.search(":");
		if (point == -1) { haisou_code = haisou; }
		else { haisou_code = haisou.substr(0, point); }
		// 伝票種類コードの取得
		point = denpyo.search(":");
		if (point == -1) { denpyo_syurui = denpyo; }
		else { denpyo_syurui = denpyo.substr(0, point); }
		// チェック
		if (haisou_code != fm.check_haiso_gyosya.value) { alert("同包の商品と配送業者が異なるので、登録できません。"); if (!flgShokaiFlg_Haiso) { fm.haisou_gyosya.focus() }; return false; }
		if (fm.hatten_code.value != fm.check_hatten_code.value) { alert("同包の商品と発店コードが異なるので、登録できません。"); if (!flgShokaiFlg_Haiso) { fm.hatten_code.focus() }; return false; }
		if (denpyo_syurui != fm.check_denpyo_syurui.value) { alert("同包の商品と伝票種類が異なるので、登録できません。"); if (!flgShokaiFlg_Haiso) { fm.denpyo_syurui_nm.focus() }; return false; }
		if (fm.syukka_maker_cd.value != fm.check_syukka_maker_cd.value) { alert("同包の商品と出荷元が異なるので、登録できません。"); if (!flgShokaiFlg_Haiso) { fm.syohin_code.focus() }; return false; }
		if (fm.insatu_code.value != fm.check_insatu_maker_cd.value) { alert("同包の商品と伝票印刷先が異なるので、登録できません。"); if (!flgShokaiFlg_Haiso) { fm.insatu_code.focus() }; return false; }
		if (fm.haiso_ondo_cd.value != fm.check_haiso_ondo_cd.value) { alert("同包の商品と配送温度帯が異なるので、登録できません。"); if (!flgShokaiFlg_Haiso) { fm.syohin_code.focus() }; return false; }
		// 予備４を同包チェックからはずす   del by yoshiyasu 2002/06/20
		//if ( fm.yobi4.value != fm.check_yobi4.value ) { alert("同包の商品と予備４が異なるので、登録できません。"); if (!flgShokaiFlg_Haiso){fm.syohin_code.focus()}; return false; }
		// ＥＤＩ連携フラグを同包チェックに追加   add by r.akanuma 2018/04/01⇒画面非表示対応に合わせてコメントアウト
		//if ( fm.edi_renkei_flg.value != fm.check_edi_renkei_flg.value ) { alert("同包の商品とＥＤＩ連携が異なるので、登録できません。"); if (!flgShokaiFlg_Haiso){fm.edi_renkei_flg.focus()}; return false; }
	}

	//2014/09/24 add KUBO --------------------
	if (!cmnCheckMaxLengthB(fm.memo.value, 2500)) { alert(MSG_0011); fm.memo.focus(); return false; }
	//2014/09/24 add KUBO --------------------
	
	//事故理由の入力チェック
	if("98" != fm.jiko_code.value && "" != fm.jiko_riyu.value){	//98 = その他
		if(syubetu == 2 ||syubetu == 3 || syubetu == 5){
			alert("事故理由「その他」以外の場合は入力できません");
			fm.jiko_riyu.focus();
			return false;
		}
	}

	return true;
}
// 文字列中の指定文字を除去する
function RemoveString(source, removestr) {
	var result = "";
	var testChar = "";
	var idx;
	for (idx = 0; idx < source.length; idx++) {
		testChar = source.substring(idx, idx + 1);
		if (testChar != removestr) {
			result = result.concat(testChar);
		}
	}
	return result;
}

function kensaku_Click() {
	var fr = document.kensaku;
	if (fr.order_no.value == "") {
		alert(MSG_0002);
		fr.order_no.focus();
		return;
	}
	if (fr.gyo_no.value == "") {
		alert(MSG_0002);
		fr.gyo_no.focus();
		return;
	}
	// 枝ＮＯ追加   2001/06/29 yoshiyasu
	if (fr.eda_no.value == "") {
		// 入力なしの場合はデフォルトで"01"にする
		fr.eda_no.value = "01";
		//        alert(MSG_0002);
		//        fr.eda_no.focus();
		//        return;
	}

	fr.submit();
}

function checkLength(txt, b) {
	if (!cmnCheckMaxLengthB(cmnTrim(txt.value), b)) {
		alert(MSG_0011);
		txt.focus();
		return;
	}
}

function checkMaxMoji(chkVal, maxLen, fldNm) {
	if (!cmnCheckMaxLengthB(cmnTrim(chkVal), maxLen)) {
		alert(fldNm + "が最大文字数を超えています。最大" + maxLen + "バイトです。");
		return false;
	} else {
		return true;
	}
}

function likeRadio(n) {
	for (i = 0; i < document.result.sekinin_kubun.length; i++) {
		if (i != n) {
			document.result.sekinin_kubun[i].checked = false;
		}
	}
}

// add by yoshiyasu 2002/01/08
// 商品コードが変更されたら、商品選択フラグをクリア("0")にする
function chgSyohinCode() {
	var frm = document.result;
	frm.syohin_sel_flg.value = "0";
}

// 担当者ダイアログ表示     add by yoshiyasu 2001/11/16
function OpenDlg010() {
	var frm = document.result;
	//ダイアログパラメータ設定
	with (document.dlg010) {
		TantoCode.value = frm.tanto_code.value;
		TantoName.value = frm.tanto_name.value;
	}

	//担当者ダイアログ表示
	OpenDialogWindow(document.dlg010);   //in common dialog script
}
// 担当者ダイアログリターン  
function getDlg010Parameters(tantocd, tantonm) {
	//リターン：担当者コード・名称
	with (document.result) {
		tanto_code.value = tantocd;
		tanto_name.value = tantonm;
	}
}

// 申込者ダイアログ表示
function OpenDlg020(index) {
	//ダイアログパラメータ設定
	with (document.dlg020) {
		//if (index == '0') {
		if (index == 'irai') {
			// 依頼主
			TelNo.value = document.result.irai_tel.value;
		} else if (index == 'mosikomi') {
			// 申込者
			TelNo.value = document.result.txtMO_TELNO.value;
		} else {
			TelNo.value = document.result.todokesaki_tel.value;
		}
	}

	//申込者ダイアログ表示
	//index：リターン後に値をセットする行番号
	OpenDialogWindow(document.dlg020, index);   //in common dialog script
}
// 申込者ダイアログリターン
function getDlg020Parameters() {

	var index = CommonDialogSaveParameters;             //セットする行番号
	var colarray = getDlg020Parameters.arguments[0];    //リターン配列

	//リターンパラメータを取得しフォームフィールドにセット
	var myform = document.result;
	with (myform) {
		//if (index == '0') {
		if (index == 'irai' || index == 'mosikomi') {
			if (index == 'irai') {
				//依頼者
				irai_yubin.value = colarray[5];
				irai_tel.value = colarray[6];
				irai_address_1.value = colarray[7];
				irai_address_2.value = colarray[8];
				irai_name_1.value = colarray[2];
				irai_name_2.value = colarray[3];
				irai_name_3.value = colarray[4];
				irai_no.value = colarray[0];
				irai_rireki.value = colarray[1];
			} else {
				//申込者
				txtMO_YUBINNO.value = colarray[5];
				txtMO_TELNO.value = colarray[6];
				txtMO_ADDR1.value = colarray[7];
				txtMO_ADDR2.value = colarray[8];
				txtMO_NM1.value = colarray[2];
				txtMO_NM2.value = colarray[3];
				txtMO_NM3.value = colarray[4];
				txtMO_KYAKUNO.value = colarray[0];
				hidMO_RIREKINO.value = colarray[1];
			}
			var flgBbs = (hidBBS_FLG.value == '1');                     // BBSフラグ
			var flgDispMosikomi = (txtMO_TELNO.type == 'text');  	// 申込者情報表示フラグ
			// 申込者情報を表示している場合は、申込者の検索時
			// 申込者情報を表示していない場合は、依頼主の検索時に支払方法をセットする
			if ((flgDispMosikomi && index == 'mosikomi') || (!flgDispMosikomi && index == 'irai')) {
				var select_flg = 0;
				if (flgBbs) {
					var siharaiHoho = colarray[12];                      // 支払方法
					for (count = 0; count < shiharai_houhou.length; count++) {
						if (siharaiHoho == shiharai_houhou[count].value) {
							select_flg = 1;
							shiharai_houhou[count].checked = true;
							break;
						}
					}
					if (select_flg == 0) shiharai_houhou[0].checked = true;
				} else {
					var d_card_type = colarray[9];                      // カード種類
					for (count = 0; count < card_type.options.length; count++) {
						var type_value = new String(card_type.options[count].value);
						// カード種類が等しいものを選択する
						if (d_card_type == type_value.substr(0, 2)) {
							select_flg = 1;
							card_type.options[count].selected = true;
							break;
						}
					}
					if (select_flg == 0) card_type.options[0].selected = true;
					// 管理者またはLANの場合、カード番号は非表示になっている	2004/05/12
					if (hidADMIN_FLG.value != "1" && hidLAN_FLG.value != "1") {
						card_no.value = colarray[10];
					}
					yuukou_kigen.value = colarray[11];
					var houhou = colarray[12];                      // 支払方法
					select_flg = 0;
					for (count = 0; count < shiharai_houhou.options.length; count++) {
						var houhou_value = new String(shiharai_houhou.options[count].value);
						// カード種類が等しいものを選択する
						if (houhou == houhou_value.substr(0, 2)) {
							select_flg = 1;
							shiharai_houhou.options[count].selected = true;
							break;
						}
					}
					if (select_flg == 0) shiharai_houhou.options[0].selected = true;
					shiharai_kaisu.value = colarray[13];
				}
				shiharai_bikou.value = colarray[14];
			}
		} else {
			//お届け先
			todokesaki_yubin.value = colarray[5];
			todokesaki_tel.value = colarray[6];
			todokesaki_address_1.value = colarray[7];
			todokesaki_address_2.value = colarray[8];
			todokesaki_name_1.value = colarray[2];
			todokesaki_name_2.value = colarray[3];
			todokesaki_name_3.value = colarray[4];
			todokesaki_rireki.value = colarray[1];
		}
	}
}

// 商品ダイアログ表示
function OpenDlg030() {

	//商品ダイアログパラメータセット
	var myform = document.result;
	var shubetucd = '';

	if (myform.order_bunrui.value == '3') {
		shubetucd = '3';
	} else if (myform.order_bunrui.value == '4') {
		shubetucd = '4';
	} else {
		if (myform.jyutyu_kubun[0].checked) {
			shubetucd = '1';

			// 2007.06.27
		} else if (myform.jyutyu_kubun[2].checked) {
			// チョイス(コース)が選択されてる場合

			shubetucd = '5';
		} else if (myform.jyutyu_kubun[3].checked) {
			// チョイス(商品)が選択されてる場合

			shubetucd = '6';
		} else {
			shubetucd = '2';
		}
	}

	with (document.dlg030) {
		TokuisakiCode.value = myform.tokuisaki_code.value;  // add by yoshiyasu 2001/11/24
		ShohinCode.value = myform.syohin_code.value;
		ShohinName.value = myform.syohin_name.value;	// add 2005/07/29
		ShohinShubetuCode.value = shubetucd;
		if (shubetucd == '3') {
			KensakuShubetu.value = '2';
			if (myform.jyutyu_kubun_irregular.checked) {
				KakuteiCourse.value = "";
			} else {
				KakuteiCourse.value = myform.kakutei_course.value;
			}
		}
	}

	//商品ダイアログ表示
	//index：リターン後に値をセットする行番号
	OpenDialogWindow(document.dlg030);   //in common dialog script
}

// 商品ダイアログリターン
function getDlg030Parameters() {
	//リターン：一般／フリー、商品コード、名称、ｅｔｃ
	if (getDlg030Parameters.arguments.length == 0) { return; }
	var colarray = getDlg030Parameters.arguments[0];    //リターン配列

	with (document.result) {
		syohin_sel_flg.value = "2";             // 商品選択フラグ   add by yoshiyasu 2002/01/08
		syohin_code.value = colarray[0];         //商品コード
		hidden_syohin_code.value = colarray[0];         //商品コード
		syohin_name.value = colarray[1];         //商品名
		syohin_syubetu.value = colarray[2];
		syohin_tourokubi.value = colarray[3];     //商品登録日
		syukkamoto_name.value = colarray[4];      //出荷元名
		siiresaki_name.value = colarray[37];      //仕入先名
		siire_maker_cd.value = colarray[38];      //仕入先メーカー得意先コード
		denpyou_soufusaki_name.value = colarray[18];      //伝票送付先名
		denpyo_soufusaki_code.value = colarray[19];      //伝票送付先メーカー得意先コード
		denpyou_insatusaki_name.value = colarray[25];      //伝票印刷先名
		switch (colarray[27]) {//配送温度帯コード
	    case "0":
	        haiso_ondo.value = "常温";
	        break;
	    case "1":
	        haiso_ondo.value = "冷蔵";
	        break;
	    case "2":
	        haiso_ondo.value = "冷凍";
	        break;
	    case "3":
	        haiso_ondo.value = "チルド";
	        break;
	    case "9":
	        haiso_ondo.value = "なし";
	        break;
	    default:
	        haiso_ondo.value = "未設定";
		}
		//denpyo_syurui.value = colarray[7];      //伝票種類名
		//denpyo_syurui_nm.value = colarray[7];      //伝票種類名
		siire_tanka.value = colarray[9];         //サンリッチ仕入単価 add by shibata 2001/05/07
		sunrich_syohin_code.value = colarray[11];   // サンリッチ商品コード add by yoshiyasu 2001/12/04
		hanbai_tanka.value = colarray[12];          // サンリッチ販売単価   add by yoshiyasu 2001/12/04
		syukka_kikan_s.value = colarray[34];        // 出荷可能期間開始日   add by yoshiyasu 2003/10/27
		syukka_kikan_e.value = colarray[35];        // 出荷可能期間終了日   add by yoshiyasu 2003/10/27
		hidFAX_HACHU_FLG.value = colarray[39];      // ＦＡＸ発注フラグ     add by yoshiyasu 2004/04/06
		var futan_kubun = colarray[21];             // 送料負担区分         add by yoshiyasu 2001/12/04
		if (soryo_futan.length > 0) {
			for (i = 0; i < soryo_futan.length; i++) {
				if (elements['soryo_futan'].options[i].value == futan_kubun) {
					elements['soryo_futan'].options[i].selected = true;
					break;
				}
			}
		} else {
			soryo_futan.value = futan_kubun;
		}

		//if ( order_bunrui.value != '3' ) {    // del by yoshiyasu 2001/12/11
		if (colarray[2] == '1') {
			jyutyu_kubun[0].checked = true;

			// 2007.06.27 kawahara
		} else if (colarray[2] == '5') {
			// チョイス(コース)の場合

			jyutyu_kubun[2].checked = true;
		} else if (colarray[2] == '6') {
			// チョイス(コース)の場合

			jyutyu_kubun[3].checked = true;

		} else if (colarray[2] != '4') {
			jyutyu_kubun[1].checked = true;
		}
		order_bunrui.value = colarray[2];

		kakaku_hanbai.value = colarray[5];          //販売価格
		hidden_kakaku_hanbai.value = colarray[5];          //販売価格
		kakaku_shiire.value = colarray[6];          //仕入価格
		hidden_kakaku_shiire.value = colarray[6];          //仕入価格

		//            syohin_num.value = '1';                      //数量（デフォルト＝１）
		syohin_num_max.value = colarray[8];           //最大同包個数
		hidden_syohin_max.value = colarray[8];           //最大同包個数
		//}
		// add start 2002/04/24 yoshiyasu  --------------------------------------------
		var haisou_code = colarray[22];                         // 配送業者コード
		var count;

		var haisoCdList = colarray[29];
		var haisoNmList = colarray[30];
		var eigyoCdList = colarray[31];
		var haisoCdArray = haisoCdList.split(",");
		var haisoNmArray = haisoNmList.split(",");
		var eigyoCdArray = eigyoCdList.split(",");
		var selectIndex = 0;		// 商品に登録されている配送業者コードのインデックス
		// 配送業者リストのクリア
		haisou_gyosya.options.length = 1;
		if (haisoCdList.length > 0) {
			for (index = 0; index < haisoCdArray.length; index++) {
				if (haisoCdArray[index] == haisou_code) selectIndex = index;
				// 配送業者リストに追加する(valueは "配送業者コード:配送業者名" にする)
				haisou_gyosya.options[index] = new Option(haisoNmArray[index], haisoCdArray[index] + ":" + haisoNmArray[index]);
			}
		} else {
			// メーカーに配送業者が登録されていない場合、リストの表示をクリアする
			haisou_gyosya.options[0] = new Option('', '');
		}
		hidEIGYO_CD_LIST.value = eigyoCdList;
		// 商品の配送業者を選択する
		haisou_gyosya.options[selectIndex].selected = true;

		createJikanCombo(haisou_code);

		insatu_code.value = colarray[24];           // 伝票印刷先コード
		insatu_nm.value = colarray[25];             // 伝票印刷先名
		var denpyou_code = colarray[23];                        // 伝票種類コード
		var cbo_denpyou = elements['denpyo_syurui_nm'];
		for (count = 0; count < cbo_denpyou.options.length; count++) {
			var denpyou_syurui = new String(cbo_denpyou.options[count].value);
			// 伝票種類コードが等しいものを選択する
			if (denpyou_code == denpyou_syurui.substr(0, 2)) {
				cbo_denpyou.options[count].selected = true;
				break;
			}
		}
		edi_renkei_flg.value = colarray[40];        // ＥＤＩ連携フラグ    add by r.akanuma 2018/04/01
		hatten_code.value = colarray[26];           // 発店コード
		syukka_maker_cd.value = colarray[16];       // 出荷元メーカー得意先コード
		haiso_ondo_cd.value = colarray[27];            // 配送温度帯コード
		yobi4.value = colarray[28];                 // 予備４
		// add end   2002/04/24 yoshiyasu  --------------------------------------------
		tanpin_code.value = colarray[33];           // 単品コード   add by yoshiyasu 2002/09/13
		syohin_kigo.value = colarray[10];           // 商品記号
	}
}
// add by hashimoto 2002/03/12
// 配送業者を変更時、発店コードをセットする
function SelectHaisou() {
	var frm = document.result;

	with (document.result) {
		var index = haisou_gyosya.selectedIndex;
		var eigyoCdList = hidEIGYO_CD_LIST.value;
		var eigyoCdArray = eigyoCdList.split(",");
		hatten_code.value = eigyoCdArray[index];
	}

	// 時間指定コンボボックスを再作成する   add by yoshiyasu 2003/05/06
	var haiso_gyosya = frm.haisou_gyosya[frm.haisou_gyosya.selectedIndex].value;
	var haiso_array = haiso_gyosya.split(":");
	createJikanCombo(haiso_array[0]);
}
// メーカー情報ダイアログ表示
function OpenDlg510(index) {
	//ダイアログパラメータ設定
	with (document.dlg510) {
		GamenID.value = 'JC1010';
		if (index == '1') {
			//            TokuisakiCode.value = document.result.shiiresaki_tkcode.value;
		} else if (index == '2') {
			TokuisakiCode.value = document.result.syukka_maker_cd.value;
		} else if (index == '3') {
			//            TokuisakiCode.value = document.result.soufusaki_tkcode.value;
		} else if (index == '5') {
			TokuisakiCode.value = document.result.denpyo_soufusaki_code.value;
		} else if (index == '6') {
			TokuisakiCode.value = document.result.siire_maker_cd.value;
		} else {
			TokuisakiCode.value = document.result.insatu_code.value;
		}
	}

	//メーカー情報ダイアログ表示
	OpenDialogWindow(document.dlg510);   //in common dialog script
}
// add by hashimoto 2002/03/15
// 配送業者営業所情報ダイアログ表示
function OpenDlg520() {
	// 配送業者は"コード:配送業者名"になっているので、コードのみを取得する
	var haisou = document.result.haisou_gyosya.value;
	var haisou_code;
	var point;
	//alert(haisou);
	point = haisou.search(":");
	if (point == -1) { haisou_code = haisou; }
	else { haisou_code = haisou.substr(0, point); }

	//ダイアログパラメータ設定
	with (document.dlg520) {
		HaisouGyousyaCode.value = haisou_code;
		EigyousyoCode.value = document.result.hatten_code.value;
	}

	//配送業者営業所情報ダイアログ表示
	OpenDialogWindow(document.dlg520);   //in common dialog script
}

// お客様控えPDF印刷が押された時に使用
function print_pdf() {
	fm = document.result;
	// 通販とギフトでお客様控えを分ける change by yoshiyasu 2002/10/01
	if (fm.order_bunrui.value == '4') {
		// 通販の場合
		fm.func.value = document.result.pdffunc_tuuhan.value;
		fm.view.value = document.result.pdfview_tuuhan.value;
	} else {
		// ギフトの場合
		fm.func.value = document.result.pdffunc.value;
		fm.view.value = document.result.pdfview.value;
	}

	// 2007.07.26 kawahara ターゲットを指定する
	fm.target = "_blank";

	fm.denpyou_syurui_mei.value = "999"; 
	
	fm.submit();
}

// 売上計上用リストPDF印刷が押された時に使用
function print_urilist_pdf() {
	fm = document.result;
	fm.func.value = document.result.urilist_pdffunc.value;
	fm.view.value = document.result.urilist_pdfview.value;

	// 2007.07.26 kawahara ターゲットを指定する
	fm.target = "_blank";

	fm.submit();
}

// CSV(問合せ回答表)印刷が押された時に使用 add by yoshiyasu 2002/05/23
function print_csv() {
	fm = document.result;
	fm.func.value = document.result.csvfunc.value;
	fm.view.value = document.result.csvview.value;
    // hiddenフィールドからdcountを取得
   

    var selectElement = document.getElementById("labelDropdown");
    var selectedIndex = -1;
	var selectedIndexSender = 0;  // 初期値を0に設定


	// 宛名のラジオボタンの選択状態をチェック
    for (var i = 0; i < fm.toiawase_atena.length; i++) {
        if (fm.toiawase_atena[i].checked) {
            selectedIndex = i; // 選択された宛名のラジオボタンのインデックスを取得
            break;
        }
    }
    
   // 差出人のラジオボタンの選択状態をチェック
   if (fm.toiawase_sender && fm.toiawase_sender.length) {
        for (var i = 0; i < fm.toiawase_sender.length; i++) {
            if (fm.toiawase_sender[i].checked) {
                selectedIndexSender = i; // 選択された差出人のラジオボタンのインデックスを取得
                break;
            }
        }
    }
    	
    // dcountが1以上の場合にのみアラートを表示
    var dcount = parseInt(fm.dcount.value, 10);  // hiddenフィールドからdcountの値を整数として取得
    if (dcount >= 1) {
        if (selectElement) {
            selectedOption = selectElement.options[selectElement.selectedIndex]; // 選択されたオプションを取得

            // ドロップダウンが空の時アラートを表示
            if (selectedIndex=='5' && selectedOption.value === '') {
                alert("宛名を選択してください。");
                return; // 処理を中止
            }
                        // 選択されたオプションの値をhiddenフィールドにセット
    fm.hiddenKaisya.value = selectedOption.getAttribute('data-kaisya');
    fm.hiddenTanto.value = selectedOption.getAttribute('data-tanto');
    fm.hiddenTel.value = selectedOption.getAttribute('data-tel');
    fm.hiddenFax.value = selectedOption.getAttribute('data-fax');

        }
    }

    fm.toiawase_sender.value = selectedIndexSender.toString();
    
    fm.action = 'excelfunc';
    fm.target = ""; // ターゲットを空白にする
    fm.submit();
}

// 時間帯コンボボックスを作成する
function createJikanCombo(haiso_cd) {
	var frm = document.result;
	var jikan_list = frm.elements['Jikan_List' + haiso_cd].value;
	var jikan_array = jikan_list.split(",");
	var cmbJikan = frm.shitei_jikan;
	var old_jikan = cmbJikan[cmbJikan.selectedIndex].value;

	//2012/06/01 change KUBO
	//配送情報のみ変更権限で、配送業者を変更すると disable:true にする必要がある。
	cmbJikan.disabled = false;

	cmbJikan.options.length = 0;
	for (count = 0; count < jikan_array.length; count++) {
		var jikan_koumoku = jikan_array[count].split("%");
		cmbJikan.options[count] = new Option(jikan_koumoku[1], jikan_koumoku[0]);
	}
	for (count = 0; count < cmbJikan.length; count++) {
		if (cmbJikan[count].value == old_jikan) {
			cmbJikan[count].selected = true;
			break;
		}
	}
}

// 名入れを変更した場合 add by yoshiyasu 2003/05/28
function fChangeNaire() {
	var frm = document.result;
	var cmbNAIRE = frm.noshi_naire_code;         // 名入れコンボボックス
	var txtNAIRE = frm.noshi_naire_name;   // 名入れその他テキストボックス
	var txtNAME1 = frm.irai_name_1;
	var txtNAME2 = frm.irai_name_2;
	var txtNAME3 = frm.irai_name_3;

	var sSelNaire = cmbNAIRE[cmbNAIRE.selectedIndex].value;
	if (sSelNaire == '0') { // なし
		txtNAIRE.value = '';
	} else if (sSelNaire == '1') {  // 姓のみ
		var sSimei = txtNAME3.value;
		var simei_array = sSimei.split(/[ 　]/);
		if (simei_array.length < 3) {
			txtNAIRE.value = '//' + simei_array[0];
		} else {
			txtNAIRE.value = '//' + simei_array[1];
		}
	} else if (sSelNaire == '2') {  // 名のみ
		var sSimei = txtNAME3.value;
		var simei_array = sSimei.split(/[ 　]/);
		if (simei_array.length == 1) {
			txtNAIRE.value = '//' + simei_array[0];
		} else if (simei_array.length == 2) {
			txtNAIRE.value = '//' + simei_array[1];
		} else {
			txtNAIRE.value = '//' + simei_array[2];
		}
	} else if (sSelNaire == '3') {  // 姓名
		txtNAIRE.value = '//' + txtNAME3.value;
	} else if (sSelNaire == '4') {  // 社名のみ
		txtNAIRE.value = txtNAME1.value + '//';
	} else if (sSelNaire == '5') {  // 社名部課
		txtNAIRE.value = txtNAME1.value + '/' + txtNAME2.value + '/';
	} else if (sSelNaire == '8') {  // すべて
		txtNAIRE.value = txtNAME1.value + '/' + txtNAME2.value + '/' + txtNAME3.value;
	} else if (sSelNaire == '9') {  // その他
		// 変更なし
	}
}

// 伝票印刷先メーカーダイアログ表示
function OpenDlg051() {
	var frm = document.result;
	//ダイアログパラメータ設定
	with (document.dlg051) {
		makerCd.value = frm.insatu_code.value;
	}

	//伝票印刷先メーカーダイアログ表示
	OpenDialogWindow(document.dlg051);   //in common dialog script
}

function getDlg051Parameters() {
	if (getDlg051Parameters.arguments.length == 0) { return; }
	var colarray = getDlg051Parameters.arguments[0];    //リターン配列

	with (document.result) {
		insatu_code.value = colarray[0];
		denpyou_insatusaki_name.value = colarray[1];
		hidINSATUSAKI_FLG.value = '1';
	}
}

// 伝票印刷先変更
function EditInsatusaki() {
	document.result.hidINSATUSAKI_FLG.value = '';
}

// 受注入力日/商品情報のdisableセット/解除
function SetDisable(blndisable) {
	if (fm.Disable_Kaijo.value == '1') {
		if (fm.order_bunrui.value == '4') {
			fm.jyutyu_kubun_04.disabled = blndisable;              // [商品配送]種別(ラジオボタン：通販)
		} else {
			fm.jyutyu_kubun_07.disabled = blndisable;              // [商品配送]種別(ラジオボタン：一般)
			fm.jyutyu_kubun_08.disabled = blndisable;              // [商品配送]種別(ラジオボタン：フリーチョイス)
			fm.jyutyu_kubun_05.disabled = blndisable;              // [商品配送]種別(ラジオボタン：チョイス(コース))
			fm.jyutyu_kubun_06.disabled = blndisable;              // [商品配送]種別(ラジオボタン：チョイス(商品))
		}
		fm.jyutyu_kubun_irregular.disabled = blndisable;  	   // [商品配送]イレギュラーチェックボックス
		fm.syohin_code.disabled = blndisable;                  // [商品配送]商品コード
		fm.syohin_kensaku.disabled = blndisable;               // [商品配送]商検索ボタン
		fm.tanpin_code.disabled = blndisable;                  // [商品配送]単品コード
		fm.syohin_kigo.disabled = blndisable;                  // [商品配送]記号
		fm.syohin_name.disabled = blndisable;                  // [商品配送]商品名称
		fm.kit_kanri_no.disabled = blndisable;                 // [商品配送]管理№
		fm.syohin_num.disabled = blndisable;                   // [商品配送]数量
		fm.syohin_num_max.disabled = blndisable;               // [商品配送]最大数量
		fm.siire_tanka.disabled = blndisable;                  // [サンリッチ]仕入単価
		fm.hanbai_tanka.disabled = blndisable;                 // [サンリッチ]販売単価
	}
	return true;
}


//「のしを印字する」チェックボックスクリック時に起動
function chgNoshiPrintFlag() {
	fm = document.result;
	if (fm.noshi_print_flag.checked) {
		// 「イメージ表示」ボタンは使用可
		fm.nosi_sampleImg_hyouji.disabled = false;
	} else {
		// 「イメージ表示」ボタンは使用不可
		fm.nosi_sampleImg_hyouji.disabled = true;
	}
}



// 「イメージ表示」ボタンクリック時に起動
async function print_nosi_img_pdf() {
	fm = document.result;
	fm.func.value = "function.Jc3013PDF";
	fm.view.value = "view.Jc3013PDF";
	
	if(previewFlg === 0){
		const form = document.querySelector('form[name="result"]');
		initialFormData = new FormData(form);
	}
	
	// 検索中メッセージを表示
    const loadingMessage = document.getElementById('loadingMessage');
    const pdfViewer = document.getElementById('pdfViewer');
    const zoomControls = document.querySelector('.zoom-controls');
    loadingMessage.style.display = 'block';
    pdfViewer.style.display = 'none';
    zoomControls.style.display = 'none';
    
     // モーダルを開く
    const modal1 = document.getElementById('modal-2__open');
    modal1.checked = true;
    
	
	try{
		const modal = document.getElementById('pdfModal');
        const pdfViewer = document.getElementById('pdfViewer');
        const response = await fetch ('/web2000/web2000',{
				method: 'POST',
                body: new FormData(fm)
	   }); // ここに生成したPDFのURLを設定する
        
        const pdfBlob = await response.blob();

            // PDFを画像に変換する
            const pdfData = new Uint8Array(await pdfBlob.arrayBuffer());
            const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({ canvasContext: context, viewport: viewport }).promise;

            // 画像データURLを生成
            const imgDataUrl = canvas.toDataURL();
            
            // 画像の横幅を取得
      		const img = new Image();
     	    img.onload = function() {
            const width = img.width;
            
            // 取得した横幅をdivのstyle.widthに設定
            const modalSizeDiv = document.getElementById('modal_content-wrap_PDF');
            modalSizeDiv.style.width = (width + 50) + 'px';
      	    };
            img.src = imgDataUrl;
            
             // 生成した画像をモーダルで表示する
     	    const pdfImage = document.getElementById('pdfViewer');
            pdfImage.src = imgDataUrl;
            
             // 拡大／縮小した画像サイズを元に戻す
        	resetImageScale();
      	
	      	 // PDF画像を表示し、検索中メッセージを非表示にする
	        pdfViewer.src = imgDataUrl;
	        loadingMessage.style.display = 'none';
	        pdfViewer.style.display = 'block';
	        zoomControls.style.display = 'block';
            

        }
         catch (error) {
            console.error('Error fetching or processing PDF:', error);
        }
}

var previewFlg = 0;
var initialFormState; 
var initialValues = {};

//配送伝票プレビューイメージ表示
async function print_preview_img_pdf() {
	checkFormChanges();
	fm = document.result;
	fm.func.value = "function.Jc3014PDF";
    fm.view.value = "view.Sc2050PDF";
    
    fm.tokuisaki_code.value;
    fm.order_no.value;
    fm.gyo_no.value;
    fm.eda_no.value;
    fm.sakuseibi.value;
    
    if(previewFlg === 0){
		initialFormState = getFilteredFormState();
	}
	
	// モーダルを開く
    const modal1 = document.getElementById('modal-2__open');
    modal1.checked = true;

    // 検索中メッセージを表示
    const loadingMessage = document.getElementById('loadingMessage');
    const pdfViewer = document.getElementById('pdfViewer');
    const zoomControls = document.querySelector('.zoom-controls');
    loadingMessage.style.display = 'block';
    pdfViewer.style.display = 'none';
    zoomControls.style.display = 'none';
    
	try{
		const modal = document.getElementById('pdfModal');
        const pdfViewer = document.getElementById('pdfViewer');
        
        const response = await fetch ('/web2000/web2000',{
				method: 'POST',
                body: new FormData(fm)
	   }); // ここに生成したPDFのURLを設定する
	   
	   if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const contentType = response.headers.get('Content-Type');
        
         if (contentType.includes('application/pdf')) {
            // レスポンスがPDFの場合
            const pdfBlob = await response.blob();
            
                        // PDFを画像に変換する
            const pdfData = new Uint8Array(await pdfBlob.arrayBuffer());
            const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({ canvasContext: context, viewport: viewport }).promise;

            // 画像データURLを生成
        	const imgDataUrl = canvas.toDataURL();
        	const img = new Image();
        	img.onload = function() {
            const width = img.width;
            
            // 取得した横幅をdivのstyle.widthに設定
            const modalSizeDiv = document.getElementById('modal_content-wrap_PDF');
            modalSizeDiv.style.width = (width + 52) + 'px';
        };
        img.src = imgDataUrl;
        // 生成した画像をモーダルで表示する
        const pdfImage = document.getElementById('pdfViewer');
        pdfImage.src = imgDataUrl;
        
        // 拡大／縮小した画像サイズを元に戻す
        resetImageScale();
        
         // PDF画像を表示し、検索中メッセージを非表示にする
        pdfViewer.src = imgDataUrl;
        loadingMessage.style.display = 'none';
        pdfViewer.style.display = 'block';
        zoomControls.style.display = 'block';
        
        document.getElementById('img_position').scrollLeft = 0; //画像の横位置リセット
  		document.getElementById('img_position').scrollTop = 0; //画像の縦位置リセット
        } 
        else {
        // その他の形式のレスポンスの場合
        const text = await response.text();
			
		const newWindow = window.open('', '_blank');
        newWindow.document.open();
        newWindow.document.write(text);
        newWindow.document.close();
        modal1.checked = false;
			
        }

        }
     catch (error) {
	 }
}


let currentScale = 1;

function zoomIn() {
    currentScale += 0.1;
    updateImageScale();
}

function zoomOut() {
    if (currentScale > 0.1) {
        currentScale -= 0.1;
        updateImageScale();
    }
}

function updateImageScale() {
    const pdfViewer = document.getElementById('pdfViewer');
    pdfViewer.style.transform = `scale(${currentScale})`;
}



//2020/06/12
//サンリッチ商品マスタ作成
function makeSunrichShohinMaster() {
	var frm = document.ShohinMaster;
	var fm = document.result;

	var result_shoyin_cd = fm.hidden_syohin_code.value;
	var result_tokuisaki_cd = fm.tokuisaki_code.value;
	var result_syohin_name = fm.syohin_name.value;
	var result_tourokubi = fm.syohin_tourokubi.value;

	if (result_shoyin_cd != "" && result_tokuisaki_cd != "" && result_syohin_name != "" && result_tourokubi != "") {
		frm.shokai_syohin_code.value = result_shoyin_cd;
		frm.txtOTHER_SHOHIN_CD.value = result_shoyin_cd;
		frm.syohin_code.value = result_shoyin_cd;

		frm.shokai_tokuisaki_code.value = result_tokuisaki_cd;
		frm.txtOTHER_TOKUI_CD.value = result_tokuisaki_cd;
		frm.hidFIND_TOKUI_CD.value = result_tokuisaki_cd;

		frm.syohin_name.value = result_syohin_name;

		frm.shokai_syohin_tourokubi.value = result_tourokubi;


		frm.LOGIN.value = "ON";
		frm.submit();
	} else {
		alert("商品を選択してください。"); return;
	}
}

window.onload = function() {
	initialFormState = getFilteredFormState();
}

function checkFormChanges() {
var currentFormState = getFilteredFormState();

	if (JSON.stringify(initialFormState) !== JSON.stringify(currentFormState)) {
	alert('入力項目が変更された可能性があります。プレビューは変更前のデータで表示されます。');
	previewFlg = 1;
	} 
}


function getFilteredFormState() {
	    return $('form[name="result"]').serializeArray().filter(function(item) {
        var element = $('[name="' + item.name + '"]');
        return element.is('input[type="text"], input[type="radio"], input[type="checkbox"], select, textarea');
	});
}

function resetImageScale() {
    currentScale = 1;
    updateImageScale();
}


