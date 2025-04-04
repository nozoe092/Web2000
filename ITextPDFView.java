/*
 * @(#)EnilibPDFView.java  1.0 00/02/07
 *
 * Copyright (c) 1999 Nippon Steel Corporation, All Rights Reserved.
 *
 */

package jp.co.enicom.oita.dc.mykext;

import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.Map;

import jp.co.enicom.oita.myk.ITextFileDownload;
import jp.co.enicom.oita.myk.MYKContext;
import jp.co.enicom.oita.myk.MYKException;
import jp.co.enicom.oita.myk.ViewData;
import jp.co.enicom.oita.util.DateTools;

public abstract class ITextPDFView extends ITextFileDownload implements EnilibConstants {

    private MYKContext context;
//    private PrintWriter out;
    final String PROPERTY_PDF_MIME = "content.mime.pdf";
      
    final String PROPERTY_PDF_ENCODING = "pdf.encoding";
    // 佐川PDF用ファイル名
    final String PROPERTY_PDF_SAGAWA_NAME = ".sagawa.filename";
    //public String LABEL_ROOT_PATH;
    public String LABEL_PDF_ENCODING;
    
    // 2006.10.12 郵パック対応 kawahara
    public final static String PROPERTY_PDF_YUPACK_NAME = ".yupack.filename";
    // 2006.10.12 ヤマト平面対応 kawahara
    public final static String PROPERTY_PDF_YAMATO_NAME = ".yamato.filename";
    // 2006.10.25 ヤマトのし平面対応 kawahara
    public final static String PROPERTY_PDF_YAMATO_NOSI_NAME = ".yamato.nosi.filename";
    // 2006.11.07 郵パックのし平面対応 kawahara
    public final static String PROPERTY_PDF_YUPACK_NOSI_NAME = ".yupack.nosi.filename";
    // 2007.06.07 ペリカンのし平面対応 kawahara
    public final static String PROPERTY_PDF_PERIKAN_NAME = ".perikan.filename";
    // 2007.06.25 マイチョイス平面対応 kawahara
    public final static String PROPERTY_PDF_MY_CHOICE_NAME = ".choice.filename";
// 2008.04.22 add start nagakura 66.ペリカンのし付平面追加
    // 2008.04.22 ペリカンのし付平面対応 nagakura
    public final static String PROPERTY_PDF_PERIKAN_NOSI_NAME = ".perikan.nosi.filename";
// 2008.04.22 add end
    //2010/12/08 add KUBO ST　//請求書
    public final static String PROPERTY_PDF_SkTANPYO_NAME = ".SeikyuTanpyo.filename";  //単票請求書
    public final static String PROPERTY_PDF_SkGOKEI_NAME = ".SeikyuGokei.filename";    //合計請求書
    public final static String PROPERTY_PDF_SkYUBINFURI_NAME = ".SeikyuYubinFuri.filename";//郵便振込付き請求書
    //2010/12/08 add KUBO END
    //2012/08/08 ヤマト代引対応、佐川代引対応 hoshihara ST
    public final static String PROPERTY_PDF_YAMATO_DAIBIKI_NAME = ".yamato.daibiki.filename";
    public final static String PROPERTY_PDF_SAGAWA_DAIBIKI_NAME = ".sagawa.daibiki.filename";
    //2012/08/08 ヤマト代引対応、佐川代引対応 hoshihara END

    
    
    // パブリックメソッド
    /**
     * @param     c    MYKContextインスタンス
     * @param     name 論理名
     * @exception MYKException 初期化エラー発生時
     */
    public void init(MYKContext c, String name) throws MYKException {
        super.init(c, name);
        context = c;
        //LABEL_ROOT_PATH = context.getProperty(ENILIB_PROPERTY_ROOT_PATH);
        LABEL_PDF_ENCODING = context.getProperty(PROPERTY_PDF_ENCODING);
    }

    /**
     * ログを出力
     * @param String ログ文字列
     * @see#ErrLogger#log()
     */
    public void logPrint(String msg)
    {
        try 
        {
// change by k-honda
//            String logmsg = new String(msg.getBytes("EUC_JP"),"ISO8859_1");

            this.context.getErrorLogger().log(msg, null);
        }
        catch (Exception ex)
        {
        }
    }

    /**
     * クライアントにPDFを転送する.
     * @param     vd 出力先を格納したViewDataインスタンス
     * @exception MYKException HTMLテンプレートの変数の置き換えに失敗した場合
     *            またはクライアントへの出力エラーが発生した場合
     */
    public void showDownloadView(ViewData vd) throws MYKException {
        try {
            String mime = context.getProperty(PROPERTY_PDF_MIME);
            
	        // 2006.10.12 伝票様式毎にファイル名をプロップファイルから取得
            // ファイル名をセット
            Object[] obj = (Object[])vd.getValue();
            Map param = (Map)obj[0]; // パラメータ取得
            
            String name = "";
            
            if (param.get("denpyou_syurui_mei").toString().equals("999")) {
                System.out.println("if文の中に入りました: denpyou_syurui_mei = 999");
            }
            
            	

            if (param.get("denpyou_syurui_mei").toString().equals("13")) {
                name = context.getProperty(getLogicalName() + PROPERTY_PDF_SAGAWA_NAME);
            } else if (param.get("denpyou_syurui_mei").toString().equals("10")) {
                name = context.getProperty(getLogicalName() + PROPERTY_PDF_YUPACK_NAME);
            } else if (param.get("denpyou_syurui_mei").toString().equals("07")) {
                name = context.getProperty(getLogicalName() + PROPERTY_PDF_YAMATO_NAME);
            } else if (param.get("denpyou_syurui_mei").toString().equals("12")) {
                name = context.getProperty(getLogicalName() + PROPERTY_PDF_YAMATO_NOSI_NAME);
            } else if (param.get("denpyou_syurui_mei").toString().equals("11")) {
                name = context.getProperty(getLogicalName() + PROPERTY_PDF_YUPACK_NOSI_NAME);
            } else if (param.get("denpyou_syurui_mei").toString().equals("09")) {
                name = context.getProperty(getLogicalName() + PROPERTY_PDF_PERIKAN_NAME);
            } else if (param.get("denpyou_syurui_mei").toString().equals("14")) {
            	name = context.getProperty(getLogicalName() + PROPERTY_PDF_MY_CHOICE_NAME);
            }
//     2008.04.22 add start nagakura 66.ペリカンのし付平面追加
            // ペリカンのし付が選択された場合、ファイル名をセット
	        else if (param.get("denpyou_syurui_mei").toString().equals("15")) {
	        	name = context.getProperty(getLogicalName() + PROPERTY_PDF_PERIKAN_NOSI_NAME);
	     
//     2008.04.22 add end
	        //2012/08/08 add HOSHIHARA ST
	        } else if (param.get("denpyou_syurui_mei").toString().equals("16")) {
	            name = context.getProperty(getLogicalName() + PROPERTY_PDF_YAMATO_DAIBIKI_NAME);
	        } else if (param.get("denpyou_syurui_mei").toString().equals("24")) {
	            name = context.getProperty(getLogicalName() + PROPERTY_PDF_SAGAWA_DAIBIKI_NAME);
	        //2012/08/08 add HOSHIHARA END
	            
        	//2010/12/08 add KUBO ST  add KUBO 請求書発行    	            
            } else if (param.get("denpyou_syurui_mei").toString().equals("101")) {
            	name = context.getProperty(getLogicalName() + PROPERTY_PDF_SkTANPYO_NAME);
            } else if (param.get("denpyou_syurui_mei").toString().equals("102")) {
	        	name = context.getProperty(getLogicalName() + PROPERTY_PDF_SkGOKEI_NAME);
            } else if (param.get("denpyou_syurui_mei").toString().equals("103")) {
	        	name = context.getProperty(getLogicalName() + PROPERTY_PDF_SkYUBINFURI_NAME);
	        } else if (param.get("denpyou_syurui_mei").toString().equals("104")) {
	        	name = "Seikyu_" + DateTools.getCurDateTime() + ".zip";
	        	mime = "application/zip";
	        }
            

            // UN1030 請求書の分割ボタン(zip出力)からでない場合にファイル名を上書きする
            if(!param.get("denpyou_syurui_mei").toString().equals("104")) {
        		// 出力の種別が「6」(UN1030 請求書印刷ボタン)からでない場合
        		if(param.get("shori_shubetu") == null || !param.get("shori_shubetu").toString().equals("6")) {
        			// ファイル名のパラメータにセットされている場合
                	if(param.get("outputFileName") != null) {
	            		String outputFileName = (String)param.get("outputFileName");
	            		name = outputFileName + ".pdf";
                	}
        		}
            	
            }
            
            //2010/12/08 add KUBO END
	                 
                
                
            
            
            if ( name != null ) {              
            	//name = "iso-2022-jp'ja'%1B%24B%24%5B%244%24%5B%242%1B%28B.fdf";
            	setFileName(vd, name);
            }

            OutputStream out = super.getFileDownloadWriter(vd, mime);
            
            showPDF(vd, out);
        } catch (MYKException e) {
        	this.context.getErrorLogger().log(e);
            throw e;
        } catch (Exception ex) {
        	this.context.getErrorLogger().log(ex);
        	throw new MYKException(ex);
        }
    }
    
    /**
     * このクラスを継承したクラスにおいて、その固有の機能をこのメソッドに実装する.<br>
     * このメソッド中で発生するExceptionはすべてこのメソッド中で処理しなければならない.
     * @param vd  ViewData
     * @param out PrintWriter
     */
    public abstract void showPDF(ViewData vd, OutputStream out) throws MYKException;

    /**
     * このクラスを継承したクラスにおいて、その固有の機能をこのメソッドに実装する.<br>
     * このメソッド中で発生するExceptionはすべてこのメソッド中で処理しなければならない.
     * @param vd  ViewData
     * @param out PrintWriter
     */
    public abstract void showPDF(ViewData vd, PrintWriter out) throws MYKException;


}