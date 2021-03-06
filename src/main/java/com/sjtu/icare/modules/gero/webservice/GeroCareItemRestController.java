/**
 * @Package com.sjtu.icare.modules.gero.webservice
 * @Description TODO
 * @date Mar 17, 2015 10:54:55 AM
 * @author Wang Qi
 * @version TODO
 */
package com.sjtu.icare.modules.gero.webservice;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.sjtu.icare.common.config.ErrorConstants;
import com.sjtu.icare.common.utils.BasicReturnedJson;
import com.sjtu.icare.common.utils.MapListUtils;
import com.sjtu.icare.common.utils.ParamUtils;
import com.sjtu.icare.common.web.rest.MediaTypes;
import com.sjtu.icare.common.web.rest.RestException;
import com.sjtu.icare.modules.op.entity.CareItemEntity;
import com.sjtu.icare.modules.op.service.IItemService;

@RestController
@RequestMapping({"${api.web}/gero/{gid}/care_item", "${api.service}/gero/{gid}/care_item"})
public class GeroCareItemRestController {
	private static Logger logger = Logger.getLogger(GeroCareItemRestController.class);
	
	@Autowired IItemService itemService;
	
	@RequestMapping(method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Object getGeroCareItems(
			@PathVariable("gid") int geroId
			) {
		
		// 获取基础的 JSON返回
		BasicReturnedJson basicReturnedJson = new BasicReturnedJson();
	
		// 参数检查
		// 参数预处理
		
		try {
			CareItemEntity queryCareItemEntity = new CareItemEntity();
			queryCareItemEntity.setGeroId(geroId);
			List<CareItemEntity> careItemEntities = itemService.getCareItems(queryCareItemEntity);
			
			// 构造返回的 JSON
			if (careItemEntities != null) {
				for (CareItemEntity careItemEntity : careItemEntities) {
					Map<String, Object> resultMap = new HashMap<String, Object>(); 
					resultMap.put("id", careItemEntity.getId()); 
					resultMap.put("gero_id", careItemEntity.getGeroId()); 
					resultMap.put("name", careItemEntity.getName()); 
					resultMap.put("icon", careItemEntity.getIcon()); 
					resultMap.put("level", careItemEntity.getLevel()); 
					resultMap.put("period", careItemEntity.getPeriod()); 
					resultMap.put("frequency", careItemEntity.getFrequency()); 
					resultMap.put("notes", careItemEntity.getNotes()); 
					
					basicReturnedJson.addEntity(resultMap);
				}
				
			}

			return basicReturnedJson.getMap();
			
		} catch (Exception e) {
			String otherMessage = "[" + e.getMessage() + "]";
			String message = ErrorConstants.format(ErrorConstants.GERO_CARE_ITEMS_GET_SERVICE_FAILED, otherMessage);
			logger.error(message);
			throw new RestException(HttpStatus.INTERNAL_SERVER_ERROR, message);
		}
	
	}

	@Transactional
	@RequestMapping(method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Object postGeroCareItem(
			@PathVariable("gid") int geroId,
			@RequestBody String inJson
			) {	
		// 将参数转化成驼峰格式的 Map
		Map<String, Object> tempRquestParamMap = ParamUtils.getMapByJson(inJson, logger);
		tempRquestParamMap.put("geroId", geroId);
		Map<String, Object> requestParamMap = MapListUtils.convertMapToCamelStyle(tempRquestParamMap);
		
		
		String name;
		String icon;
		Integer level;
		Integer period;
		Integer frequency;
		String notes;
		
		try {
			name = (String) requestParamMap.get("name");
			icon = (String) requestParamMap.get("icon");
			level = (Integer) requestParamMap.get("level");
			period = (Integer) requestParamMap.get("period");
			frequency = (Integer) requestParamMap.get("frequency");
			notes = (String) requestParamMap.get("notes");
			
			if (name == null || icon == null || level == null || period == null || frequency == null || notes == null)
				throw new Exception();
			
			// 参数详细验证
			// TODO
			
		} catch(Exception e) {
			String otherMessage = "[name=" + requestParamMap.get("name") + "]" +
					"[icon=" + requestParamMap.get("icon") + "]" +
					"[level=" + requestParamMap.get("level") + "]" +
					"[period=" + requestParamMap.get("period") + "]" +
					"[frequency=" + requestParamMap.get("frequency") + "]" +
					"[notes=" + requestParamMap.get("notes") + "]";
			String message = ErrorConstants.format(ErrorConstants.GERO_CARE_ITEM_POST_PARAM_INVALID, otherMessage);
			logger.error(message);
			throw new RestException(HttpStatus.BAD_REQUEST, message);
		}
		
		// 获取基础的 JSON
		BasicReturnedJson basicReturnedJson = new BasicReturnedJson();
		
		// 插入数据
		try {
			CareItemEntity postEntity = new CareItemEntity(); 
			BeanUtils.populate(postEntity, requestParamMap);
			itemService.insertCareItem(postEntity);
		} catch(Exception e) {
			String otherMessage = "[" + e.getMessage() + "]";
			String message = ErrorConstants.format(ErrorConstants.GERO_CARE_ITEM_POST_SERVICE_FAILED, otherMessage);
			logger.error(message);
			throw new RestException(HttpStatus.INTERNAL_SERVER_ERROR, message);
		}

		return basicReturnedJson.getMap();
		
	}
	
	@RequestMapping(value="/{itemid}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Object getGeroCareItem(
			@PathVariable("gid") int geroId,
			@PathVariable("itemid") int itemId
			) {
		
		// 获取基础的 JSON返回
		BasicReturnedJson basicReturnedJson = new BasicReturnedJson();
	
		// 参数检查
		// 参数预处理
		
		try {
			CareItemEntity queryCareItemEntity = new CareItemEntity();
			queryCareItemEntity.setGeroId(geroId);
			queryCareItemEntity.setId(itemId);
			CareItemEntity careItemEntity = itemService.getCareItem(queryCareItemEntity);
			
			if (careItemEntity != null) {
				
				// 构造返回的 JSON
				Map<String, Object> resultMap = new HashMap<String, Object>(); 
				resultMap.put("id", careItemEntity.getId()); 
				resultMap.put("gero_id", careItemEntity.getGeroId()); 
				resultMap.put("name", careItemEntity.getName()); 
				resultMap.put("icon", careItemEntity.getIcon()); 
				resultMap.put("level", careItemEntity.getLevel()); 
				resultMap.put("period", careItemEntity.getPeriod()); 
				resultMap.put("frequency", careItemEntity.getFrequency()); 
				resultMap.put("notes", careItemEntity.getNotes()); 
				
				basicReturnedJson.addEntity(resultMap);
			}

			return basicReturnedJson.getMap();
			
		} catch (Exception e) {
			String otherMessage = "[" + e.getMessage() + "]";
			String message = ErrorConstants.format(ErrorConstants.GERO_CARE_ITEM_GET_SERVICE_FAILED, otherMessage);
			logger.error(message);
			throw new RestException(HttpStatus.INTERNAL_SERVER_ERROR, message);
		}
	
	}

	@Transactional
	@RequestMapping(value="/{itemid}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Object putGeroCareItem(
			@PathVariable("gid") int geroId,
			@PathVariable("itemid") int itemId,
			@RequestBody String inJson
			) {	
		// 将参数转化成驼峰格式的 Map
		Map<String, Object> tempRquestParamMap = ParamUtils.getMapByJson(inJson, logger);
		tempRquestParamMap.put("geroId", geroId);
		tempRquestParamMap.put("id", itemId);
		Map<String, Object> requestParamMap = MapListUtils.convertMapToCamelStyle(tempRquestParamMap);
		
		
		String name;
		String icon;
		Integer level;
		Integer period;
		Integer frequency;
		String notes;
		
		try {
			name = (String) requestParamMap.get("name");
			icon = (String) requestParamMap.get("icon");
			level = (Integer) requestParamMap.get("level");
			period = (Integer) requestParamMap.get("period");
			frequency = (Integer) requestParamMap.get("frequency");
			notes = (String) requestParamMap.get("notes");
			
			if (name == null || icon == null || level == null || period == null || frequency == null || notes == null)
				throw new Exception();
			
			// 参数详细验证
			// TODO
			
		} catch(Exception e) {
			String otherMessage = "[name=" + requestParamMap.get("name") + "]" +
					"[icon=" + requestParamMap.get("icon") + "]" +
					"[level=" + requestParamMap.get("level") + "]" +
					"[period=" + requestParamMap.get("period") + "]" +
					"[frequency=" + requestParamMap.get("frequency") + "]" +
					"[notes=" + requestParamMap.get("notes") + "]";
			String message = ErrorConstants.format(ErrorConstants.GERO_CARE_ITEM_PUT_PARAM_INVALID, otherMessage);
			logger.error(message);
			throw new RestException(HttpStatus.BAD_REQUEST, message);
		}
		
		// 获取基础的 JSON
		BasicReturnedJson basicReturnedJson = new BasicReturnedJson();
		
		// 插入数据
		try {
			CareItemEntity putEntity = new CareItemEntity(); 
			BeanUtils.populate(putEntity, requestParamMap);
			itemService.updateCareItem(putEntity);
		} catch(Exception e) {
			String otherMessage = "[" + e.getMessage() + "]";
			String message = ErrorConstants.format(ErrorConstants.GERO_CARE_ITEM_PUT_SERVICE_FAILED, otherMessage);
			logger.error(message);
			throw new RestException(HttpStatus.INTERNAL_SERVER_ERROR, message);
		}

		return basicReturnedJson.getMap();
		
	}
	
	@Transactional
	@RequestMapping(value = "/{itemid}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Object deleteGeroCareItem(
			@PathVariable("gid") int geroId,
			@PathVariable("itemid") int itemId
			) {	
		// 将参数转化成驼峰格式的 Map
		Map<String, Object> tempRquestParamMap = new HashMap<String, Object>();
		tempRquestParamMap.put("geroId", geroId);
		tempRquestParamMap.put("id", itemId);
		Map<String, Object> requestParamMap = MapListUtils.convertMapToCamelStyle(tempRquestParamMap);
		
		// 获取基础的 JSON
		BasicReturnedJson basicReturnedJson = new BasicReturnedJson();
		
		// 删除数据
		try {
			CareItemEntity inputEntity = new CareItemEntity(); 
			BeanUtils.populate(inputEntity, requestParamMap);
			itemService.deleteCareItem(inputEntity);
		} catch(Exception e) {
			String otherMessage = "[" + e.getMessage() + "]";
			String message = ErrorConstants.format(ErrorConstants.GERO_CARE_ITEM_DELETE_SERVICE_FAILED, otherMessage);
			logger.error(message);
			throw new RestException(HttpStatus.INTERNAL_SERVER_ERROR, message);
		}

		return basicReturnedJson.getMap();
		
	}
	
	
}
